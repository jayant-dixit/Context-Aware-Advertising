import json
import os
import re
import time
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone
from rank_bm25 import BM25Okapi

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
ADS_FILE = BASE_DIR / "data" / "ads.json"

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "context-ads")
NAMESPACE = os.getenv("PINECONE_NAMESPACE", "advertisements")

EMBEDDING_MODEL = "llama-text-embed-v2"

# Business Analyst Quality Controls (Calibrated for Niche Props & Gear)
MIN_AD_SCORE = 0.34          # Accessible threshold: allows strong contextual/prop matches (>= 0.34)
MIN_DENSE_SCORE = 0.10       # Dense Gatekeeper: rejects pure 0.000 ghost matches while allowing niche props (>= 0.10)
MAX_AD_RESULTS = 3

# Global lazy BM25 index and data map
_bm25_index = None
_ads_list = []
_ads_by_id = {}


def get_client():
    if not PINECONE_API_KEY:
        raise RuntimeError(
            "PINECONE_API_KEY is missing from your .env file."
        )
    return Pinecone(api_key=PINECONE_API_KEY)


def create_index_if_needed():
    """
    Create the Pinecone index with integrated embeddings if it doesn't exist.
    """
    pc = get_client()

    print("Checking Pinecone index...")

    if pc.has_index(INDEX_NAME):
        print(f"[OK] Pinecone index already exists: {INDEX_NAME}")
        return pc.Index(INDEX_NAME)

    print(f"Creating Pinecone index: {INDEX_NAME}")

    pc.create_index_for_model(
        name=INDEX_NAME,
        cloud="aws",
        region="us-east-1",
        embed={
            "model": EMBEDDING_MODEL,
            "field_map": {
                "text": "text"
            }
        }
    )

    print("[*] Waiting for Pinecone index...")

    while True:
        description = pc.describe_index(INDEX_NAME)
        status = description.status
        if isinstance(status, dict):
            ready = status.get("ready", False)
        else:
            ready = getattr(status, "ready", False)

        if ready:
            break
        time.sleep(2)

    print("[OK] Pinecone index is ready.")
    return pc.Index(INDEX_NAME)


def build_ad_text(ad):
    """
    Convert advertisement metadata into a semantic text representation.
    """
    return (
        f"Brand: {ad['brand']}. "
        f"Advertisement: {ad['title']}. "
        f"Category: {ad['category']}. "
        f"Description: {ad['description']}. "
        f"Keywords: {', '.join(ad.get('keywords', []))}. "
        f"Target audience: {', '.join(ad.get('audience', []))}. "
        f"Emotions: {', '.join(ad.get('emotion', []))}."
    )


def load_ads():
    global _ads_list, _ads_by_id
    if not _ads_list:
        with open(ADS_FILE, "r", encoding="utf-8") as f:
            _ads_list = json.load(f)
        _ads_by_id = {ad["id"]: ad for ad in _ads_list}
    return _ads_list


def tokenize_text(text: str) -> list:
    """
    Split text into clean lower-case alphanumeric tokens for BM25.
    """
    return re.findall(r"\w+", (text or "").lower())


def get_bm25_index():
    """
    Lazy-load and initialize the BM25 sparse keyword index on the ads catalog.
    """
    global _bm25_index
    if _bm25_index is None:
        ads = load_ads()
        corpus = [
            tokenize_text(
                f"{ad['brand']} {ad['title']} {ad['category']} {ad['description']} {' '.join(ad.get('keywords', []))}"
            )
            for ad in ads
        ]
        _bm25_index = BM25Okapi(corpus)
    return _bm25_index


def seed_ads():
    """
    Insert all advertisements into Pinecone.
    Pinecone generates the embeddings automatically via integrated embedding.
    """
    index = create_index_if_needed()
    ads = load_ads()

    records = []
    for ad in ads:
        records.append(
            {
                "_id": ad["id"],
                "text": build_ad_text(ad),
                "brand": ad["brand"],
                "title": ad["title"],
                "category": ad["category"],
                "description": ad["description"],
                "keywords": ", ".join(ad.get("keywords", [])),
                "audience": ", ".join(ad.get("audience", [])),
                "emotion": ", ".join(ad.get("emotion", [])),
            }
        )

    print(f"[*] Uploading {len(records)} advertisements...")
    BATCH_SIZE = 96

    for start in range(0, len(records), BATCH_SIZE):
        batch = records[start:start + BATCH_SIZE]
        batch_number = (start // BATCH_SIZE) + 1
        total_batches = (len(records) + BATCH_SIZE - 1) // BATCH_SIZE

        print(
            f"[*] Uploading batch {batch_number}/{total_batches} ({len(batch)} records)"
        )
        index.upsert_records(
            namespace=NAMESPACE,
            records=batch
        )
        print(f"[OK] Batch {batch_number} uploaded.")

    print("[*] Waiting for Pinecone indexing...")
    time.sleep(5)
    print("[OK] Advertisement database is ready.")
    return index


class HybridHit:
    """
    Wrapper hit object preserving Pinecone response interface.
    """
    def __init__(self, hit_id: str, score: float, fields: dict):
        self.id = hit_id
        self.score = float(score)
        self.fields = fields


def hybrid_search_ads(
    query_text: str,
    top_k: int = MAX_AD_RESULTS,
    min_score: float = MIN_AD_SCORE,
    min_dense_score: float = MIN_DENSE_SCORE,
    alpha: float = 0.65
):
    """
    Hybrid Search: Dense Vector Search (Pinecone) + Sparse Keyword Search (BM25).
    Includes Dense Gatekeeper: rejects any candidate with low semantic similarity (dense < min_dense_score).
    """
    index = create_index_if_needed()
    query_text = (query_text or "").strip()

    if not query_text:
        print("[!] Empty ad search query.")
        return None

    print(f"\n[HYBRID SEARCH] query (alpha={alpha}):")
    print(f"   {query_text}")

    # ------------------------------------------
    # 1. Dense Semantic Search (Pinecone)
    # ------------------------------------------
    results = index.search(
        namespace=NAMESPACE,
        query={
            "inputs": {
                "text": query_text
            },
            "top_k": top_k * 4
        },
        fields=[
            "brand",
            "title",
            "category",
            "description",
            "keywords",
            "audience",
            "emotion",
            "text"
        ]
    )

    pinecone_hits = results.result.hits if results and hasattr(results, "result") else []
    dense_scores = {}
    dense_fields = {}

    for hit in pinecone_hits:
        hit_id = getattr(hit, "id", None) or getattr(hit, "_id", "")
        score = float(getattr(hit, "score", 0.0))
        fields = getattr(hit, "fields", {})
        if hit_id:
            dense_scores[hit_id] = score
            dense_fields[hit_id] = fields

    # ------------------------------------------
    # 2. Sparse Keyword Search (BM25)
    # ------------------------------------------
    bm25 = get_bm25_index()
    ads = load_ads()
    query_tokens = tokenize_text(query_text)
    bm25_scores = bm25.get_scores(query_tokens)

    max_bm25 = float(bm25_scores.max()) if len(bm25_scores) > 0 else 0.0
    min_bm25 = float(bm25_scores.min()) if len(bm25_scores) > 0 else 0.0
    range_bm25 = (max_bm25 - min_bm25) if max_bm25 > min_bm25 else 1.0

    sparse_scores = {}
    for idx, ad in enumerate(ads):
        ad_id = ad["id"]
        raw_score = float(bm25_scores[idx])
        if raw_score > 0.0:
            norm_score = (raw_score - min_bm25) / range_bm25
            sparse_scores[ad_id] = norm_score

    # ------------------------------------------
    # 3. Hybrid Score Fusion + Dense Gatekeeper
    # ------------------------------------------
    all_candidate_ids = set(dense_scores.keys()) | set(
        sorted(sparse_scores.keys(), key=lambda k: sparse_scores[k], reverse=True)[:top_k * 3]
    )

    fused_candidates = []
    for cand_id in all_candidate_ids:
        d_score = dense_scores.get(cand_id, 0.0)
        s_score = sparse_scores.get(cand_id, 0.0)

        # DENSE GATEKEEPER:
        # Require a minimum semantic baseline (e.g. >= 0.20) to prevent
        # random BM25 false positives when the semantic match is near zero.
        if d_score < min_dense_score:
            continue

        # Weighted combination of dense and sparse scores
        hybrid_score = (alpha * d_score) + ((1.0 - alpha) * s_score)

        if hybrid_score >= min_score:
            fields = dense_fields.get(cand_id)
            if not fields and cand_id in _ads_by_id:
                ad_obj = _ads_by_id[cand_id]
                fields = {
                    "brand": ad_obj.get("brand", ""),
                    "title": ad_obj.get("title", ""),
                    "category": ad_obj.get("category", ""),
                    "description": ad_obj.get("description", "")
                }
            fused_candidates.append(
                HybridHit(cand_id, hybrid_score, fields or {})
            )

    # Sort by hybrid score descending
    fused_candidates.sort(key=lambda h: h.score, reverse=True)
    filtered_hits = fused_candidates[:top_k]

    if not filtered_hits:
        print(f"\n[!] No advertisement passed the quality threshold (min_score={min_score}, min_dense={min_dense_score}).")
        return None

    print(f"\n[OK] {len(filtered_hits)} high-confidence advertisements passed quality gate:")
    for h in filtered_hits:
        print(f"   {h.fields.get('brand', 'Unknown')} | Score: {h.score:.4f} (dense={dense_scores.get(h.id, 0):.3f}, bm25={sparse_scores.get(h.id, 0):.3f})")

    # Replace hits in results object to maintain API compatibility
    if hasattr(results, "result"):
        results.result.hits = filtered_hits
    else:
        results = type("HybridResponse", (), {"result": type("Result", (), {"hits": filtered_hits})()})()

    return results


def search_ads(
    query_text,
    top_k=MAX_AD_RESULTS,
    min_score=MIN_AD_SCORE,
    min_dense_score=MIN_DENSE_SCORE,
    alpha=0.65
):
    """
    Main ad retrieval method with Hybrid Search & Quality Gatekeeping.
    """
    return hybrid_search_ads(
        query_text,
        top_k=top_k,
        min_score=min_score,
        min_dense_score=min_dense_score,
        alpha=alpha
    )


def print_search_results(results):
    """
    Print Pinecone results in a clean format.
    """
    print("\n[TOP RELEVANT ADS]")
    print("=" * 60)

    if results is None:
        print("No advertisements found.")
        return

    if isinstance(results, dict):
        hits = results.get("result", {}).get("hits", [])
    else:
        result_obj = getattr(results, "result", None)
        hits = getattr(result_obj, "hits", []) if result_obj else []

    if not hits:
        print("No advertisements found.")
        return

    for i, hit in enumerate(hits, start=1):
        if isinstance(hit, dict):
            fields = hit.get("fields", {})
            score = hit.get("_score", 0.0)
        else:
            fields = getattr(hit, "fields", {})
            score = getattr(hit, "score", 0.0)

        print(f"\n{i}. {fields.get('brand', 'Unknown')}")
        print(f"   Title: {fields.get('title', '')}")
        print(f"   Category: {fields.get('category', '')}")
        print(f"   Score: {float(score):.4f}")
        print(f"   Description: {fields.get('description', '')}")


if __name__ == "__main__":
    print("=" * 60)
    print("ADVERTISEMENT VECTOR DATABASE (QUALITY GATE TEST)")
    print("=" * 60)

    test_query = (
        "person running in rain need waterproof athletic shoes nike workout"
    )
    results = search_ads(test_query)
    print_search_results(results)