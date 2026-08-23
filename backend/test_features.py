import os
from youtube_extractor import YouTubeFeatureExtractor
from pinecone_ads import search_ads

print("=" * 60)
print("TEST 1: Transcript Extraction & Window Slicing")
print("=" * 60)
ext = YouTubeFeatureExtractor()
transcript = ext.get_transcript("kTJczUoc26U")
print(f"Total transcript snippets: {len(transcript)}")

window_text = ext.get_transcript_window(transcript, timestamp=30.0, window_seconds=15.0)
print(f"Transcript window at 30s (+-15s):\n  \"{window_text}\"")

print("\n" + "=" * 60)
print("TEST 2: Hybrid Search (Dense + BM25)")
print("=" * 60)

test_query = f"person running workout fitness shoes {window_text}".strip()
print(f"Query: {test_query}\n")

results = search_ads(test_query, top_k=3, alpha=0.65)
if results and hasattr(results, "result"):
    for idx, hit in enumerate(results.result.hits, 1):
        fields = hit.fields
        print(f"{idx}. {fields.get('brand')} | Score: {hit.score:.4f} | {fields.get('title')}")

print("\n[OK] All tests completed successfully!")
