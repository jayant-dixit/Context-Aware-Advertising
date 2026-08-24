import json
import re
import threading
import uuid
from pathlib import Path

from youtube_extractor import YouTubeFeatureExtractor
from scene_detector import extract_scene_keyframes, get_timestamp
from vision_analyzer import analyze_frames_batch, analyze_video_metadata
from pinecone_ads import search_ads

MAX_BATCH_FRAMES = 3

# --------------------------------------------------
# Brand Frequency Policy: Max 2 placements per brand in full video
# --------------------------------------------------
MAX_BRAND_OCCURRENCES = 2
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
    Add an advertisement placement based on contextual relevance and frequency caps:
    - Same-ad extension allowed across consecutive scenes
    - Brand frequency cap: No brand can appear more than MAX_BRAND_OCCURRENCES (2 times)
    """
    with jobs_lock:
        if job_id not in jobs:
            return False

        placements = jobs[job_id]["placements"]
        current_timestamp = placement.get("timestamp", 0)
        current_ad = placement.get("ad", {})
        current_id = current_ad.get("id")
        current_brand = current_ad.get("brand", "")

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
        previous_id = previous_ad.get("id")

        # Case 1: Same advertisement detected -> Extend existing placement
        if previous_id and current_id and previous_id == current_id:
            previous["end_time"] = current_timestamp
            previous["end_time_formatted"] = format_timestamp(current_timestamp)
            print(f"[CADENCE] Same ad detected ({current_ad.get('brand', '')}). Extended placement duration to {current_timestamp}s.")
            return False

        # Brand Frequency Cap Check (Max 2 times per brand per video)
        if current_brand:
            brand_count = sum(1 for p in placements if p.get("ad", {}).get("brand", "").lower() == current_brand.lower())
            if brand_count >= MAX_BRAND_OCCURRENCES:
                print(f"[CAP] Brand '{current_brand}' already reached max limit ({MAX_BRAND_OCCURRENCES} times). Skipping.")
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
    extractor=None,
    metadata_context=None
):
    print(f"\n{'=' * 70}")
    print(f"[*] JOB {job_id} | Processing Scene Batch {batch_index}/{total_batches} ({len(batch)} keyframes)")
    print(f"{'=' * 70}")

    try:
        batch_results = analyze_frames_batch(batch)
        meta_query = (metadata_context.get("search_query", "") if metadata_context else "").strip()
        meta_theme = (metadata_context.get("theme", "") if metadata_context else "").strip()

        for result in batch_results:
            frame_index = result["frame_index"]
            if frame_index >= len(batch):
                continue

            frame_path = batch[frame_index]
            timestamp = get_timestamp_from_filename(frame_path.name)
            scene = result.get("scene", "") or meta_theme
            vision_query = result.get("search_query", "").strip()

            # Align spoken transcript in ±15s window around scene timestamp
            spoken_text = ""
            if extractor and transcript:
                spoken_text = extractor.get_transcript_window(
                    transcript,
                    timestamp,
                    window_seconds=15.0
                )

            # Multimodal context fusion: Vision + Spoken Audio + Overarching Metadata
            query_parts = []
            if vision_query:
                query_parts.append(vision_query)
            if spoken_text:
                query_parts.append(spoken_text)
            if meta_query:
                # If visual query is weak/empty or short, append global metadata context
                if not vision_query or len(vision_query.split()) < 4:
                    query_parts.append(meta_query)
                else:
                    # Append select category terms
                    query_parts.append(meta_query)

            multimodal_query = " ".join(query_parts).strip()

            if not multimodal_query:
                print(f"\n[*] Scene Keyframe: {frame_path.name} | Timestamp: {timestamp}s")
                print(f"    Visual Scene: {scene}")
                print(f"    [!] No commercial context detected. Skipped.")
                continue

            print(f"\n[*] Scene Keyframe: {frame_path.name} | Timestamp: {timestamp}s")
            print(f"    Visual Scene: {scene}")
            print(f"    Visual Query: {vision_query}")
            if spoken_text:
                print(f"    Spoken Transcript: \"{spoken_text}\"")
            if meta_query:
                print(f"    Video Theme/Meta Query: \"{meta_query}\"")
            print(f"    Fused Search Query: {multimodal_query}")

            # Hybrid Search (Dense + BM25 Sparse + Gatekeeper)
            results = search_ads(
                multimodal_query,
                top_k=8,
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

            # Calculate Brand Frequency Counts & Last Placed Brand
            brand_counts = {}
            last_brand = None
            with jobs_lock:
                if job_id in jobs and jobs[job_id]["placements"]:
                    current_placements = jobs[job_id]["placements"]
                    last_brand = current_placements[-1].get("ad", {}).get("brand", "").lower()
                    for p in current_placements:
                        b = p.get("ad", {}).get("brand", "").lower()
                        if b:
                            brand_counts[b] = brand_counts.get(b, 0) + 1

            # Candidate Selection:
            # 1. Prefer brand under cap (< MAX_BRAND_OCCURRENCES) and NOT identical to immediately previous brand (rotation)
            best_ad = None
            for h in hits:
                b = h.fields.get("brand", "").lower()
                if brand_counts.get(b, 0) >= MAX_BRAND_OCCURRENCES:
                    continue
                if last_brand and b == last_brand and len(hits) > 1:
                    continue
                best_ad = h
                break

            # 2. Fallback: If rotation not possible, pick any hit under cap
            if best_ad is None:
                for h in hits:
                    b = h.fields.get("brand", "").lower()
                    if brand_counts.get(b, 0) < MAX_BRAND_OCCURRENCES:
                        best_ad = h
                        break

            # 3. Fallback: If all returned hits for this query reached the 2-ad cap, search broader metadata context for alternative company brands
            if best_ad is None and meta_query:
                print(f"[CAP] Top brands capped. Searching alternative company brands from video context...")
                fallback_results = search_ads(
                    meta_query,
                    top_k=10,
                    min_score=0.28,
                    min_dense_score=0.08,
                    alpha=0.65
                )
                if fallback_results and hasattr(fallback_results, "result"):
                    for h in fallback_results.result.hits:
                        b = h.fields.get("brand", "").lower()
                        if brand_counts.get(b, 0) < MAX_BRAND_OCCURRENCES:
                            best_ad = h
                            print(f"[ALT BRAND SELECTED] Using alternative brand '{h.fields.get('brand')}' ({h.fields.get('title')})")
                            break

            if best_ad is None:
                print("[!] No eligible ad found within brand frequency limits (max 2 per brand).")
                continue

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
    extractor = None
    video_id = None

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
        # 0. Check precomputed cache
        # --------------------------------------
        results_dir = Path(extractor.dirs["results"])
        results_file = results_dir / f"{video_id}.json"

        if results_file.exists():
            try:
                with open(results_file, "r", encoding="utf-8") as f:
                    cached_data = json.load(f)

                cached_placements = cached_data.get("placements", [])
                print(f"⚡ [CACHE HIT] Loaded precomputed analysis for video: {video_id} ({len(cached_placements)} placements)")

                update_job(
                    job_id,
                    status="completed",
                    progress=100,
                    video_id=video_id,
                    total_chunks=1,
                    completed_chunks=1,
                    placements=cached_placements
                )
                print(f"🎉 JOB {job_id} COMPLETED VIA CACHE")
                return
            except Exception as cache_err:
                print(f"[!] Failed to read cache: {cache_err}. Proceeding with fresh analysis.")

        # --------------------------------------
        # 1. Download video & metadata
        # --------------------------------------
        video_path = extractor.download_video_and_metadata(
            youtube_url,
            video_id
        )

        metadata = extractor.get_metadata(video_id)
        video_meta_duration = int(metadata.get("duration") or 0)

        # --------------------------------------
        # 1.5. Analyze Video Metadata (Title, Description, Tags, Genre)
        # --------------------------------------
        print(f"\n[AI] Analyzing video metadata description & content genre...")
        metadata_context = analyze_video_metadata(metadata)

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
        video_duration = video_meta_duration or (max(timestamps) + 30 if timestamps else 0)

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
                extractor=extractor,
                metadata_context=metadata_context
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
        # 4.5. Static / Low Scene Motion Handling (Songs, Podcasts, Audio Videos)
        # --------------------------------------
        with jobs_lock:
            current_placements = jobs[job_id]["placements"]
            current_count = len(current_placements)
            distinct_brands = len(set(p.get("ad", {}).get("brand") for p in current_placements if p.get("ad", {}).get("brand")))

        # If zero placements passed or video has fewer than 2 distinct brands
        if current_count == 0 or (video_duration >= 60 and distinct_brands < 2):
            print(f"\n[*] Minimal scene changes or low brand diversity detected ({distinct_brands} brands for {video_duration}s video).")
            print(f"[*] Activating Description & Genre-Based Ad Distribution...")
            meta_query = metadata_context.get("search_query", "").strip()
            if meta_query:
                meta_ads_result = search_ads(
                    meta_query,
                    top_k=10,
                    min_score=0.30,
                    min_dense_score=0.08,
                    alpha=0.65
                )
                if meta_ads_result and meta_ads_result.result.hits:
                    hits = meta_ads_result.result.hits
                    seen_brands = set()
                    unique_hits = []
                    for h in hits:
                        b = h.fields.get("brand", "")
                        if b not in seen_brands:
                            seen_brands.add(b)
                            unique_hits.append(h)

                    # Distribute across timeline
                    num_ads = min(3, len(unique_hits))
                    step = max(45, video_duration // (num_ads or 1))

                    for idx, hit in enumerate(unique_hits[:num_ads]):
                        ts = idx * step
                        if ts >= video_duration and idx > 0:
                            break
                        placement = {
                            "timestamp": ts,
                            "timestamp_formatted": format_timestamp(ts),
                            "scene": metadata_context.get("theme", "Contextual ad placement derived from video content metadata"),
                            "search_query": meta_query,
                            "spoken_transcript": "",
                            "ad": {
                                "id": hit.id,
                                "brand": hit.fields.get("brand", ""),
                                "title": hit.fields.get("title", ""),
                                "category": hit.fields.get("category", ""),
                                "description": hit.fields.get("description", "")
                            },
                            "score": float(hit.score)
                        }
                        add_placement(job_id, placement)
                        print(f"   [METADATA AD PLACED] {hit.fields.get('brand')} at {ts}s ({format_timestamp(ts)})")

        # --------------------------------------
        # 5. Close final advertisement placement & save to cache
        # --------------------------------------
        final_placements = []
        with jobs_lock:
            if job_id in jobs:
                placements = jobs[job_id]["placements"]
                if placements:
                    last_placement = placements[-1]
                    if last_placement.get("end_time") is None:
                        last_placement["end_time"] = video_duration
                        last_placement["end_time_formatted"] = format_timestamp(video_duration)
                final_placements = list(placements)

        try:
            results_dir.mkdir(parents=True, exist_ok=True)
            with open(results_file, "w", encoding="utf-8") as f:
                json.dump({
                    "video_id": video_id,
                    "youtube_url": youtube_url,
                    "video_duration": video_duration,
                    "placements": final_placements
                }, f, indent=2, ensure_ascii=False)
            print(f"[CACHE] Saved precomputed results to {results_file}")
        except Exception as save_err:
            print(f"[!] Could not save cache file: {save_err}")

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

    finally:
        # --------------------------------------
        # 6. Automatic cleanup of temporary .mp4 and frames
        # --------------------------------------
        if extractor and video_id:
            extractor.cleanup_temp_files(video_id)


# --------------------------------------------------
# Start background job
# --------------------------------------------------

def start_background_job(youtube_url):
    # 1. Sabse pehle URL se video_id nikal lo
    extractor = YouTubeFeatureExtractor()
    new_video_id = extractor.extract_video_id(youtube_url)

    if not new_video_id:
        raise ValueError("Invalid YouTube URL.")

    # 2. Check karo ki kya is video ka koi job already chal raha hai
    with jobs_lock:
        for j_id, job_data in jobs.items():
            existing_video_id = extractor.extract_video_id(job_data["youtube_url"])
            
            # Agar same video process ho rahi hai aur wo fail/complete nahi hui hai
            if existing_video_id == new_video_id and job_data["status"] not in ["completed", "failed"]:
                print(f"⚡ [DEDUPLICATION] Job already running for {new_video_id}. Returning existing Job ID: {j_id}")
                return j_id  # Purana job_id return kar do, naya thread mat banao

    # 3. Agar koi purana job nahi hai, toh hi naya job start karo
    job_id = create_job(youtube_url)
    thread = threading.Thread(
        target=run_analysis_job,
        args=(job_id,),
        daemon=True
    )
    thread.start()
    return job_id