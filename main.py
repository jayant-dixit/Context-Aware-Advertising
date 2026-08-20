# import os
# import re
# from pathlib import Path

# from dotenv import load_dotenv

# from youtube_extractor import YouTubeFeatureExtractor
# from pinecone_ads import seed_ads
# from vision_analyzer import analyze_frame_and_find_ads


# load_dotenv()


# FRAMES_PER_BATCH = int(
#     os.getenv("FRAMES_PER_BATCH", "5")
# )


# def get_timestamp_from_filename(filename):

#     match = re.search(
#         r"frame_(\d+)s",
#         filename
#     )

#     if match:
#         return int(match.group(1))

#     return None


# def get_frame_files(frame_directory):

#     frame_directory = Path(frame_directory)

#     files = list(
#         frame_directory.glob("frame_*s.jpg")
#     )

#     def sort_key(path):

#         timestamp = get_timestamp_from_filename(
#             path.name
#         )

#         return timestamp if timestamp is not None else 0

#     files.sort(key=sort_key)

#     return files


# def process_frames_in_batches(frame_directory):

#     frame_files = get_frame_files(
#         frame_directory
#     )

#     if not frame_files:

#         print(
#             "❌ No frames found."
#         )

#         return

#     print("\n")
#     print("=" * 70)
#     print(
#         f"🎬 Found {len(frame_files)} frames"
#     )

#     print(
#         f"📦 Processing "
#         f"{FRAMES_PER_BATCH} frames per batch"
#     )

#     print("=" * 70)

#     all_results = []

#     for batch_start in range(
#         0,
#         len(frame_files),
#         FRAMES_PER_BATCH
#     ):

#         batch = frame_files[
#             batch_start:
#             batch_start + FRAMES_PER_BATCH
#         ]

#         batch_number = (
#             batch_start // FRAMES_PER_BATCH
#         ) + 1

#         print("\n")
#         print(
#             f"🚀 BATCH {batch_number}"
#         )

#         print(
#             "-" * 70
#         )

#         for frame_path in batch:

#             timestamp = get_timestamp_from_filename(
#                 frame_path.name
#             )

#             print(
#                 f"\n⏱️ VIDEO TIMESTAMP: "
#                 f"{timestamp}s"
#             )

#             try:

#                 result = (
#                     analyze_frame_and_find_ads(
#                         str(frame_path)
#                     )
#                 )

#                 result["timestamp"] = timestamp
#                 result["frame"] = str(
#                     frame_path
#                 )

#                 all_results.append(
#                     result
#                 )

#             except Exception as exc:

#                 print(
#                     f"❌ Failed to process "
#                     f"{frame_path.name}: {exc}"
#                 )

#     return all_results


# def print_final_summary(results):

#     print("\n\n")

#     print("=" * 70)
#     print("🎯 FINAL CONTEXTUAL AD RESULTS")
#     print("=" * 70)

#     for result in results:

#         timestamp = result.get(
#             "timestamp"
#         )

#         context = result.get(
#             "context",
#             {}
#         )

#         ads = result.get(
#             "ads",
#             []
#         )

#         print(
#             f"\n⏱️ TIMESTAMP: "
#             f"{timestamp}s"
#         )

#         print(
#             f"Scene: "
#             f"{context.get('scene', '')}"
#         )

#         print(
#             f"Activity: "
#             f"{context.get('activity', '')}"
#         )

#         if ads:

#             best = ads[0]

#             fields = best.fields

#             print(
#                 f"📢 RECOMMENDED AD: "
#                 f"{fields.get('brand', '')}"
#             )

#             print(
#                 f"   Title: "
#                 f"{fields.get('title', '')}"
#             )

#             print(
#                 f"   Category: "
#                 f"{fields.get('category', '')}"
#             )

#             print(
#                 f"   Score: "
#                 f"{best.score:.4f}"
#             )

#         else:

#             print(
#                 "📢 No suitable ad found."
#             )

#     print("\n")
#     print("=" * 70)
#     print("✅ ANALYSIS COMPLETE")
#     print("=" * 70)


# def main():

#     print("=" * 70)
#     print("CONTEXT-AWARE ADVERTISEMENT MVP")
#     print("=" * 70)

#     print("\nStep 1: Initializing advertisement database...")

#     try:

#         seed_ads()

#     except Exception as exc:

#         print(
#             f"\n❌ Pinecone initialization failed:"
#         )

#         print(exc)

#         return

#     print("\nStep 2: YouTube video")

#     youtube_url = input(
#         "\nEnter YouTube URL: "
#     ).strip()

#     if not youtube_url:

#         print(
#             "❌ YouTube URL cannot be empty."
#         )

#         return

#     extractor = YouTubeFeatureExtractor()

#     video_id = extractor.extract_video_id(
#         youtube_url
#     )

#     if not video_id:

#         print(
#             "❌ Invalid YouTube URL."
#         )

#         return

#     print(
#         f"\n🎬 Video ID: {video_id}"
#     )

#     # --------------------------------------------------
#     # DOWNLOAD VIDEO
#     # --------------------------------------------------

#     try:

#         video_path = (
#             extractor.download_video_and_metadata(
#                 youtube_url,
#                 video_id
#             )
#         )

#     except Exception as exc:

#         print(
#             f"\n❌ Video download failed:"
#         )

#         print(exc)

#         return

#     # --------------------------------------------------
#     # EXTRACT FRAMES
#     # --------------------------------------------------

#     try:

#         extractor.extract_frames(
#             video_path,
#             video_id,
#             interval_seconds=5
#         )

#     except Exception as exc:

#         print(
#             f"\n❌ Frame extraction failed:"
#         )

#         print(exc)

#         return

#     frame_directory = os.path.join(
#         extractor.dirs["frames"],
#         video_id
#     )

#     # --------------------------------------------------
#     # VISION + VECTOR SEARCH
#     # --------------------------------------------------

#     results = process_frames_in_batches(
#         frame_directory
#     )

#     if results:

#         print_final_summary(
#             results
#         )


# if __name__ == "__main__":
#     main()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from analysis_service import analyze_youtube_video


app = FastAPI(
    title="Context-Aware Advertising API",
    description=(
        "AI-powered contextual advertisement "
        "recommendation backend."
    ),
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)


# --------------------------------------------------
# Request schema
# --------------------------------------------------

class AnalyzeRequest(BaseModel):

    youtube_url: HttpUrl


# --------------------------------------------------
# Health
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok",
        "service": "context-aware-advertising"
    }


# --------------------------------------------------
# Analyze video
# --------------------------------------------------

@app.post("/api/analyze")
def analyze_video(
    request: AnalyzeRequest
):

    try:

        result = analyze_youtube_video(
            str(request.youtube_url)
        )

        return {
            "success": True,
            "data": result
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    except Exception as exc:

        print(
            f"❌ Analysis failed: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Video analysis failed. "
                "Check backend logs."
            )
        )