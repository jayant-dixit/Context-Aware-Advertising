import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()


BASE_DIR = Path(__file__).resolve().parent
ADS_FILE = BASE_DIR / "data" / "ads.json"

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "context-ads")
NAMESPACE = os.getenv("PINECONE_NAMESPACE", "advertisements")

# Pinecone's integrated embedding model.
# This avoids us having to manage an external embedding model.
EMBEDDING_MODEL = "llama-text-embed-v2"


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
        print(f"✅ Pinecone index already exists: {INDEX_NAME}")
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

    print("⏳ Waiting for Pinecone index...")

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

    print("✅ Pinecone index is ready.")

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
        f"Keywords: {', '.join(ad['keywords'])}. "
        f"Target audience: {', '.join(ad['audience'])}. "
        f"Emotions: {', '.join(ad['emotion'])}."
    )


def load_ads():
    with open(ADS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_ads():
    """
    Insert all advertisements into Pinecone.

    Pinecone generates the embeddings automatically because
    this index uses integrated embedding.
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
                "keywords": ", ".join(ad["keywords"]),
                "audience": ", ".join(ad["audience"]),
                "emotion": ", ".join(ad["emotion"]),
            }
        )

    print(f"📦 Uploading {len(records)} advertisements...")

    index.upsert_records(
        namespace=NAMESPACE,
        records=records
    )

    print("⏳ Waiting for Pinecone indexing...")
    time.sleep(5)

    print("✅ Advertisement database is ready.")

    return index


def search_ads(query_text, top_k=3):
    """
    Search advertisements semantically using plain text.

    Pinecone performs the embedding automatically.
    """

    index = create_index_if_needed()

    print(f"\n🔎 Ad search query:")
    print(f"   {query_text}")

    results = index.search(
        namespace=NAMESPACE,
        query={
            "inputs": {
                "text": query_text
            },
            "top_k": top_k
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
    
    print("\nDEBUG PINECONE RESPONSE:")
    print(results)

    return results


def print_search_results(results):
    """
    Print Pinecone results in a clean format.
    """

    print("\n📢 TOP RELEVANT ADS")
    print("=" * 60)

    hits = results.get("result", {}).get("hits", [])

    if not hits:
        print("No advertisements found.")
        return

    for i, hit in enumerate(hits, start=1):

        fields = hit.get("fields", {})

        print(f"\n{i}. {fields.get('brand', 'Unknown')}")
        print(f"   Title: {fields.get('title', '')}")
        print(f"   Category: {fields.get('category', '')}")
        print(f"   Score: {hit.get('_score', 0):.4f}")
        print(
            f"   Description: "
            f"{fields.get('description', '')}"
        )
        print(type(hit))
        print(hit)


if __name__ == "__main__":

    print("=" * 60)
    print("ADVERTISEMENT VECTOR DATABASE")
    print("=" * 60)

    seed_ads()

    test_query = (
        "A person is exercising in a gym, "
        "wearing sports clothing and running shoes."
    )

    results = search_ads(test_query)

    print_search_results(results)