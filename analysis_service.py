import os
import re
from pathlib import Path

from youtube_extractor import YouTubeFeatureExtractor
from vision_analyzer import analyze_frame_and_find_ads


FRAME_INTERVAL_SECONDS = 5


def get_timestamp_from_filename(filename: str):
    match = re.search(
        r"frame_(\d+)s",
        filename
    )

    if match:
        return int(match.group(1))

    return None


def analyze_youtube_video(youtube_url: str):
    """
    Complete synchronous analysis pipeline.

    YouTube URL
        ↓
    Download video
        ↓
    Extract frames
        ↓
    Vision analysis
        ↓
    Pinecone ad search
        ↓
    Timestamped advertisements
    """

    extractor = YouTubeFeatureExtractor()

    # --------------------------------------------------
    # 1. Extract YouTube ID
    # --------------------------------------------------

    video_id = extractor.extract_video_id(
        youtube_url
    )

    if not video_id:
        raise ValueError(
            "Invalid YouTube URL."
        )

    print(
        f"🎬 Starting analysis for: {video_id}"
    )

    # --------------------------------------------------
    # 2. Download video
    # --------------------------------------------------

    video_path = (
        extractor.download_video_and_metadata(
            youtube_url,
            video_id
        )
    )

    # --------------------------------------------------
    # 3. Extract frames
    # --------------------------------------------------

    extractor.extract_frames(
        video_path,
        video_id,
        interval_seconds=FRAME_INTERVAL_SECONDS
    )

    # --------------------------------------------------
    # 4. Get frames
    # --------------------------------------------------

    frame_directory = Path(
        extractor.dirs["frames"]
    ) / video_id

    frame_files = list(
        frame_directory.glob(
            "frame_*s.jpg"
        )
    )

    frame_files.sort(
        key=lambda path:
        get_timestamp_from_filename(
            path.name
        ) or 0
    )

    if not frame_files:
        raise RuntimeError(
            "No frames were extracted from the video."
        )

    # --------------------------------------------------
    # 5. Analyze frames
    # --------------------------------------------------

    placements = []

    for frame_path in frame_files:

        timestamp = (
            get_timestamp_from_filename(
                frame_path.name
            )
        )

        print(
            f"\n⏱️ Processing "
            f"{timestamp}s"
        )

        try:

            result = (
                analyze_frame_and_find_ads(
                    str(frame_path)
                )
            )

            ads = result.get(
                "ads",
                []
            )

            # ------------------------------------------
            # Pick best advertisement
            # ------------------------------------------

            if ads:

                best_ad = ads[0]

                fields = best_ad.fields

                placement = {

                    "timestamp": timestamp,

                    "timestamp_formatted":
                        format_timestamp(
                            timestamp
                        ),

                    "scene":
                        result.get(
                            "scene",
                            ""
                        ),

                    "search_query":
                        result.get(
                            "search_query",
                            ""
                        ),

                    "ad": {

                        "id":
                            best_ad.id,

                        "brand":
                            fields.get(
                                "brand",
                                ""
                            ),

                        "title":
                            fields.get(
                                "title",
                                ""
                            ),

                        "category":
                            fields.get(
                                "category",
                                ""
                            ),

                        "description":
                            fields.get(
                                "description",
                                ""
                            )
                    },

                    "score":
                        float(
                            best_ad.score
                        )
                }

                placements.append(
                    placement
                )

        except Exception as exc:

            print(
                f"❌ Failed at "
                f"{timestamp}s: {exc}"
            )

            # Don't kill the entire video
            # because one frame failed.
            continue

    # --------------------------------------------------
    # 6. Final response
    # --------------------------------------------------

    return {

        "video_id":
            video_id,

        "youtube_url":
            youtube_url,

        "frame_interval":
            FRAME_INTERVAL_SECONDS,

        "total_frames":
            len(frame_files),

        "total_ad_placements":
            len(placements),

        "placements":
            placements
    }


def format_timestamp(seconds: int):

    minutes = seconds // 60

    remaining_seconds = seconds % 60

    return (
        f"{minutes:02d}:"
        f"{remaining_seconds:02d}"
    )