import re
import threading
import uuid
from pathlib import Path

from youtube_extractor import YouTubeFeatureExtractor
from scene_detector import extract_scene_keyframes, get_timestamp
from vision_analyzer import analyze_frames_batch
from pinecone_ads import search_ads

MAX_BATCH_FRAMES = 3

# --------------------------------------------------
# Cadence Policy: 2.5 minutes spacing between distinct ads
# --------------------------------------------------
MIN_AD_SPACING_SECONDS = 150   # 150 seconds (2.5 minutes) cooldown


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

        # Return a copy so callers don't mutate the internal object
        return {
            **job,
            "placements": list(job["placements"])
        }


def update_job(job_id: str, **updates):
    with jobs_lock:
        if job_id not in jobs:
            return
        jobs[job_id].update(updates)


def add_placement(job_id: str, placement: dict):
    """
    Add an advertisement placement based purely on contextual relevance:
    - Same-ad extension allowed across consecutive scenes
    - Places all high-relevance ads without cooldown suppression
    """
    with jobs_lock:
        if job_id not in jobs:
            return False

        placements = jobs[job_id]["placements"]
        current_timestamp = placement.get("timestamp", 0)

        # First placement in the video
        if not placements:
            placement["start_time"] = current_timestamp
            placement["start_time_formatted"] = format_timestamp(current_timestamp)
            placement["end_time"] = None
            placement["end_time_formatted"] = None
            placements.append(placement)
            return True

        previous = placements[-1]
        previous_ad = previous.get("ad", {})
        current_ad = placement.get("ad", {})

        previous_id = previous_ad.get("id")
        current_id = current_ad.get("id")

        # Case 1: Same advertisement detected -> Extend existing placement
        if previous_id and current_id and previous_id == current_id:
            previous["end_time"] = current_timestamp
            previous["end_time_formatted"] = format_timestamp(current_timestamp)
            print(f"[CADENCE] Same ad detected ({current_ad.get('brand', '')}). Extended placement duration to {current_timestamp}s.")
            return False

        # Close previous placement if still open
        if previous.get("end_time") is None:
            previous["end_time"] = current_timestamp
            previous["end_time_formatted"] = format_timestamp(current_timestamp)

        # Create new placement
        placement["start_time"] = current_timestamp
        placement["start_time_formatted"] = format_timestamp(current_timestamp)
        placement["end_time"] = None
        placement["end_time_formatted"] = None

        placements.append(placement)
        return True


# --------------------------------------------------
# Timestamp helpers
# --------------------------------------------------

def get_timestamp_from_filename(filename):
    match = re.search(r"frame_(\d+)s", filename)
    return int(match.group(1)) if match else None


def format_timestamp(seconds):
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    return f"{minutes:02d}:{remaining_seconds:02d}"


# --------------------------------------------------
# Process a batch of scene keyframes
# --------------------------------------------------

def process_scene_batch(
    job_id,
    batch,
    batch_index,
    total_batches,
    transcript=None,
    extractor=None
):
    print(f"\n{'=' * 70}")
    print(f"[*] JOB {job_id} | Processing Scene Batch {batch_index}/{total_batches} ({len(batch)} keyframes)")
    print(f"{'=' * 70}")

    try:
        batch_results = analyze_frames_batch(batch)

        for result in batch_results:
            frame_index = result["frame_index"]
            if frame_index >= len(batch):
                continue

            frame_path = batch[frame_index]
            timestamp = get_timestamp_from_filename(frame_path.name)
            scene = result.get("scene", "")
            vision_query = result.get("search_query", "")

            # Align spoken transcript in ±15s window around scene timestamp
            spoken_text = ""
            if extractor and transcript:
                spoken_text = extractor.get_transcript_window(
                    transcript,
                    timestamp,
                    window_seconds=15.0
                )

            # Multimodal context fusion
            if spoken_text:
                multimodal_query = f"{vision_query} {spoken_text}".strip()
            else:
                multimodal_query = vision_query.strip()

            if not multimodal_query:
                print(f"\n[*] Scene Keyframe: {frame_path.name} | Timestamp: {timestamp}s")
                print(f"    Visual Scene: {scene}")
                print(f"    [!] No commercial context detected (e.g. blank screen/intro). Skipped.")
                continue

            print(f"\n[*] Scene Keyframe: {frame_path.name} | Timestamp: {timestamp}s")
            print(f"    Visual Scene: {scene}")
            print(f"    Visual Query: {vision_query}")
            if spoken_text:
                print(f"    Spoken Transcript: \"{spoken_text}\"")
            print(f"    Fused Search Query: {multimodal_query}")

            # Hybrid Search (Dense + BM25 Sparse + Gatekeeper)
            results = search_ads(
                multimodal_query,
                top_k=3,
                min_score=0.34,
                min_dense_score=0.10,
                alpha=0.65
            )

            if results is None:
                print("[!] No sufficiently relevant advertisement passed quality gate.")
                continue

            hits = results.result.hits if hasattr(results, "result") else []
            if not hits:
                print("[!] No advertisement found.")
                continue

            best_ad = hits[0]
            fields = best_ad.fields

            placement = {
                "timestamp": timestamp,
                "timestamp_formatted": format_timestamp(timestamp),
                "scene": scene,
                "search_query": multimodal_query,
                "spoken_transcript": spoken_text,
                "ad": {
                    "id": best_ad.id,
                    "brand": fields.get("brand", ""),
                    "title": fields.get("title", ""),
                    "category": fields.get("category", ""),
                    "description": fields.get("description", "")
                },
                "score": float(best_ad.score)
            }

            added = add_placement(job_id, placement)
            if added:
                print(f"\n[AD PLACEMENT ACCEPTED]")
                print(f"   Brand: {fields.get('brand', '')}")
                print(f"   Timestamp: {timestamp}s ({format_timestamp(timestamp)})")
                print(f"   Score: {best_ad.score:.4f}")

    except Exception as exc:
        print(f"[ERROR] Batch processing failed: {exc}")


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
        video_id = extractor.extract_video_id(youtube_url)

        if not video_id:
            raise ValueError("Invalid YouTube URL.")

        print(f"\n🎬 Starting job {job_id}")
        print(f"Video ID: {video_id}")

        # --------------------------------------
        # 1. Download video & metadata
        # --------------------------------------
        video_path = extractor.download_video_and_metadata(
            youtube_url,
            video_id
        )

        # --------------------------------------
        # 2. Extract timestamped transcript
        # --------------------------------------
        transcript = extractor.get_transcript(video_id)

        update_job(
            job_id,
            status="extracting_frames",
            video_id=video_id
        )

        # --------------------------------------
        # 3. Direct Scene Keyframe Extraction (PySceneDetect)
        # --------------------------------------
        frame_directory = Path(extractor.dirs["frames"]) / video_id
        keyframe_paths = extract_scene_keyframes(
            video_path,
            output_dir=str(frame_directory),
            threshold=27.0
        )

        if not keyframe_paths:
            raise RuntimeError("No scene keyframes were extracted.")

        keyframe_paths.sort(
            key=lambda path: get_timestamp_from_filename(path.name) or 0
        )

        # Determine video duration
        timestamps = [
            get_timestamp_from_filename(path.name)
            for path in keyframe_paths
        ]
        timestamps = [t for t in timestamps if t is not None]
        video_duration = max(timestamps) + 30

        total_batches = (len(keyframe_paths) + MAX_BATCH_FRAMES - 1) // MAX_BATCH_FRAMES

        update_job(
            job_id,
            status="processing",
            total_chunks=total_batches,
            completed_chunks=0,
            progress=0
        )

        # --------------------------------------
        # 4. Process scene keyframe batches
        # --------------------------------------
        for batch_idx in range(total_batches):
            start_i = batch_idx * MAX_BATCH_FRAMES
            batch = keyframe_paths[start_i:start_i + MAX_BATCH_FRAMES]

            process_scene_batch(
                job_id,
                batch,
                batch_index=batch_idx + 1,
                total_batches=total_batches,
                transcript=transcript,
                extractor=extractor
            )

            completed_batches = batch_idx + 1
            progress = int((completed_batches / total_batches) * 100)

            update_job(
                job_id,
                completed_chunks=completed_batches,
                progress=progress
            )

            print(f"\n📊 JOB PROGRESS: {progress}%")

        # --------------------------------------
        # 5. Close final advertisement placement
        # --------------------------------------
        with jobs_lock:
            if job_id in jobs:
                placements = jobs[job_id]["placements"]
                if placements:
                    last_placement = placements[-1]
                    if last_placement.get("end_time") is None:
                        last_placement["end_time"] = video_duration
                        last_placement["end_time_formatted"] = format_timestamp(video_duration)

        update_job(
            job_id,
            status="completed",
            progress=100
        )

        print(f"\n🎉 JOB {job_id} COMPLETED")

    except Exception as exc:
        print(f"\n❌ JOB {job_id} FAILED: {exc}")
        update_job(
            job_id,
            status="failed",
            error=str(exc)
        )


# --------------------------------------------------
# Start background job
# --------------------------------------------------

def start_background_job(youtube_url):
    job_id = create_job(youtube_url)
    thread = threading.Thread(
        target=run_analysis_job,
        args=(job_id,),
        daemon=True
    )
    thread.start()
    return job_id