import re
import threading
import uuid
from pathlib import Path

from youtube_extractor import YouTubeFeatureExtractor
from vision_analyzer import analyze_frame_and_find_ads


CHUNK_DURATION_SECONDS = 30

# 3 representative frames per chunk.
# Example for 0-30s:
# 5s, 15s, 25s
FRAMES_PER_CHUNK = 3


# --------------------------------------------------
# In-memory job storage
# --------------------------------------------------

jobs = {}

jobs_lock = threading.Lock()


def create_job(youtube_url: str):

    job_id = str(uuid.uuid4())

    job = {
        "job_id": job_id,
        "youtube_url": youtube_url,
        "status": "queued",
        "progress": 0,
        "total_chunks": 0,
        "completed_chunks": 0,
        "placements": [],
        "error": None
    }

    with jobs_lock:
        jobs[job_id] = job

    return job_id


def get_job(job_id: str):

    with jobs_lock:
        job = jobs.get(job_id)

        if job is None:
            return None

        # Return a copy so callers don't mutate
        # the internal object.
        return {
            **job,
            "placements": list(
                job["placements"]
            )
        }


def update_job(job_id: str, **updates):

    with jobs_lock:

        if job_id not in jobs:
            return

        jobs[job_id].update(updates)


def add_placement(job_id: str, placement: dict):

    with jobs_lock:

        if job_id not in jobs:
            return

        jobs[job_id]["placements"].append(
            placement
        )


# --------------------------------------------------
# Timestamp helpers
# --------------------------------------------------

def get_timestamp_from_filename(filename):

    match = re.search(
        r"frame_(\d+)s",
        filename
    )

    if match:
        return int(match.group(1))

    return None


def format_timestamp(seconds):

    minutes = seconds // 60
    remaining_seconds = seconds % 60

    return (
        f"{minutes:02d}:"
        f"{remaining_seconds:02d}"
    )


# --------------------------------------------------
# Extract representative frames
# --------------------------------------------------

def get_chunk_frames(
    frame_files,
    chunk_start,
    chunk_end
):

    chunk_frames = []

    for frame_path in frame_files:

        timestamp = get_timestamp_from_filename(
            frame_path.name
        )

        if timestamp is None:
            continue

        if (
            chunk_start
            <= timestamp
            < chunk_end
        ):

            chunk_frames.append(
                frame_path
            )

    if not chunk_frames:
        return []

    # ------------------------------------------
    # Select representative frames
    # ------------------------------------------

    if len(chunk_frames) <= FRAMES_PER_CHUNK:
        return chunk_frames

    step = (
        len(chunk_frames)
        / FRAMES_PER_CHUNK
    )

    selected = []

    for i in range(FRAMES_PER_CHUNK):

        index = int(
            i * step
        )

        if index >= len(chunk_frames):
            index = len(chunk_frames) - 1

        selected.append(
            chunk_frames[index]
        )

    return selected


# --------------------------------------------------
# Analyze one chunk
# --------------------------------------------------

def process_chunk(
    job_id,
    frame_files,
    chunk_start,
    chunk_end
):

    print(
        f"\n{'=' * 70}"
    )

    print(
        f"📦 JOB {job_id}"
    )

    print(
        f"🎬 Processing chunk "
        f"{chunk_start}s → {chunk_end}s"
    )

    print(
        f"{'=' * 70}"
    )

    selected_frames = get_chunk_frames(
        frame_files,
        chunk_start,
        chunk_end
    )

    print(
        f"🖼️ Selected "
        f"{len(selected_frames)} frames"
    )

    for frame_path in selected_frames:

        timestamp = get_timestamp_from_filename(
            frame_path.name
        )

        print(
            f"\n⏱️ Processing frame "
            f"at {timestamp}s"
        )

        try:

            result = analyze_frame_and_find_ads(
                str(frame_path)
            )

            ads = result.get(
                "ads",
                []
            )

            if not ads:

                print(
                    "⚠️ No advertisement "
                    "found."
                )

                continue

            # ----------------------------------
            # Best advertisement
            # ----------------------------------

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

            add_placement(
                job_id,
                placement
            )

            print(
                f"✅ AD FOUND: "
                f"{fields.get('brand', '')}"
            )

            print(
                f"   Timestamp: "
                f"{timestamp}s"
            )

            print(
                f"   Score: "
                f"{best_ad.score:.4f}"
            )

        except Exception as exc:

            print(
                f"❌ Frame analysis failed: "
                f"{exc}"
            )

            # Continue with the next frame.
            continue


# --------------------------------------------------
# Complete background analysis
# --------------------------------------------------

def run_analysis_job(job_id):

    job = get_job(job_id)

    if not job:
        return

    youtube_url = job["youtube_url"]

    try:

        update_job(
            job_id,
            status="downloading",
            progress=0
        )

        extractor = YouTubeFeatureExtractor()

        video_id = extractor.extract_video_id(
            youtube_url
        )

        if not video_id:

            raise ValueError(
                "Invalid YouTube URL."
            )

        print(
            f"\n🎬 Starting job {job_id}"
        )

        print(
            f"Video ID: {video_id}"
        )

        # --------------------------------------
        # Download video
        # --------------------------------------

        video_path = (
            extractor.download_video_and_metadata(
                youtube_url,
                video_id
            )
        )

        update_job(
            job_id,
            status="extracting_frames",
            video_id=video_id
        )

        # --------------------------------------
        # Extract frames
        # --------------------------------------

        extractor.extract_frames(
            video_path,
            video_id,
            interval_seconds=5
        )

        frame_directory = (
            Path(
                extractor.dirs["frames"]
            )
            / video_id
        )

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
                "No frames were extracted."
            )

        # --------------------------------------
        # Determine video duration
        # --------------------------------------

        timestamps = [
            get_timestamp_from_filename(
                path.name
            )
            for path in frame_files
        ]

        timestamps = [
            timestamp
            for timestamp in timestamps
            if timestamp is not None
        ]

        video_duration = (
            max(timestamps) + 5
        )

        total_chunks = (
            video_duration
            + CHUNK_DURATION_SECONDS
            - 1
        ) // CHUNK_DURATION_SECONDS

        update_job(
            job_id,
            status="processing",
            total_chunks=total_chunks,
            completed_chunks=0,
            progress=0
        )

        # --------------------------------------
        # Process chunks sequentially
        # --------------------------------------

        for chunk_number in range(
            total_chunks
        ):

            chunk_start = (
                chunk_number
                * CHUNK_DURATION_SECONDS
            )

            chunk_end = min(
                chunk_start
                + CHUNK_DURATION_SECONDS,
                video_duration
            )

            process_chunk(
                job_id,
                frame_files,
                chunk_start,
                chunk_end
            )

            completed_chunks = (
                chunk_number + 1
            )

            progress = int(
                (
                    completed_chunks
                    / total_chunks
                )
                * 100
            )

            update_job(
                job_id,
                completed_chunks=completed_chunks,
                progress=progress
            )

            print(
                f"\n📊 JOB PROGRESS: "
                f"{progress}%"
            )

        # --------------------------------------
        # Completed
        # --------------------------------------

        update_job(
            job_id,
            status="completed",
            progress=100
        )

        print(
            f"\n🎉 JOB {job_id} COMPLETED"
        )

    except Exception as exc:

        print(
            f"\n❌ JOB {job_id} FAILED:"
        )

        print(exc)

        update_job(
            job_id,
            status="failed",
            error=str(exc)
        )


# --------------------------------------------------
# Start background job
# --------------------------------------------------

def start_background_job(
    youtube_url
):

    job_id = create_job(
        youtube_url
    )

    thread = threading.Thread(
        target=run_analysis_job,
        args=(job_id,),
        daemon=True
    )

    thread.start()

    return job_id