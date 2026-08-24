import os
import cv2
import json
import re
import shutil
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


class YouTubeFeatureExtractor:

    def __init__(self, output_dir="data"):
        self.output_dir = output_dir

        self.dirs = {
            "videos": os.path.join(output_dir, "videos"),
            "frames": os.path.join(output_dir, "frames"),
            "metadata": os.path.join(output_dir, "metadata"),
            "transcripts": os.path.join(output_dir, "transcripts"),
            "results": os.path.join(output_dir, "results")
        }

        for path in self.dirs.values():
            os.makedirs(path, exist_ok=True)

    def cleanup_temp_files(self, video_id: str, keep_video: bool = True):
        """
        Safely cleanup temporary extracted frames directory.
        Keeps downloaded .mp4 video by default so subsequent analysis never re-downloads.
        """
        if not keep_video:
            video_path = os.path.join(self.dirs["videos"], f"{video_id}.mp4")
            if os.path.exists(video_path):
                try:
                    os.remove(video_path)
                    print(f"[CLEANUP] Deleted temporary video: {video_path}")
                except Exception as e:
                    print(f"[!] Could not delete video {video_path}: {e}")

        frame_dir = os.path.join(self.dirs["frames"], video_id)
        if os.path.exists(frame_dir):
            try:
                shutil.rmtree(frame_dir)
                print(f"[CLEANUP] Deleted temporary frames directory: {frame_dir}")
            except Exception as e:
                print(f"[!] Could not delete frames directory {frame_dir}: {e}")

    def extract_video_id(self, url):
        match = re.search(
            r"(?:v=|\/|embed\/|youtu\.be\/)([0-9A-Za-z_-]{11})",
            url
        )
        return match.group(1) if match else None

    def download_video_and_metadata(self, url, video_id):
        video_path = os.path.join(self.dirs["videos"], f"{video_id}.mp4")
        metadata_path = os.path.join(self.dirs["metadata"], f"{video_id}.json")

        # 1. Reuse existing video if already downloaded
        if os.path.exists(video_path) and os.path.getsize(video_path) > 0 and os.path.exists(metadata_path):
            print(f"\n[CACHE HIT] Video file already downloaded on disk: {video_path}")
            return video_path

        print(f"\n[1/3] Downloading video: {video_id}")

        def progress_hook(d):
            if d['status'] == 'downloading':
                total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
                downloaded = d.get('downloaded_bytes') or 0
                if total > 0:
                    percent = (downloaded / total) * 100
                    last_p = getattr(progress_hook, 'last_p', -1)
                    if last_p < 0 or (percent - last_p >= 25) or percent >= 99.5:
                        speed = d.get('speed') or 0
                        speed_mb = (speed / (1024 * 1024)) if speed else 0
                        print(f"[*] Downloading: {percent:.0f}% ({speed_mb:.1f} MB/s)")
                        progress_hook.last_p = percent
            elif d['status'] == 'finished':
                print(f"[OK] Download completed successfully.")

        ydl_opts = {
            "format": "best[ext=mp4]/best",
            "outtmpl": video_path,
            "quiet": True,
            "no_warnings": True,
            "noprogress": True,
            "progress_hooks": [progress_hook],
            "http_headers": {
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                "Accept-Language": "en-US,en;q=0.9"
            },
            "extractor_args": {
                "youtube": {
                    "player_client": ["android", "web"]
                }
            }
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            metadata = {
                "id": info.get("id"),
                "title": info.get("title"),
                "description": info.get("description"),
                "tags": info.get("tags", []),
                "categories": info.get("categories", []),
                "view_count": info.get("view_count"),
                "like_count": info.get("like_count"),
                "duration": info.get("duration"),
                "channel": info.get("uploader")
            }

            with open(metadata_path, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=4, ensure_ascii=False)

        print(f"[OK] Video saved: {video_path}")
        print(f"[OK] Metadata saved: {metadata_path}")
        return video_path

    def get_metadata(self, video_id: str) -> dict:
        """
        Fetch cached video metadata (title, description, tags, categories, channel).
        """
        metadata_path = os.path.join(self.dirs["metadata"], f"{video_id}.json")
        if os.path.exists(metadata_path):
            try:
                with open(metadata_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[!] Could not read metadata {metadata_path}: {e}")
        return {}

    def get_transcript(self, video_id: str) -> list:
        """
        Fetch and cache timestamped subtitle transcript for a YouTube video.
        
        Returns:
            list of dicts: [{'text': '...', 'start': 10.5, 'duration': 2.3}, ...]
        """
        transcript_path = os.path.join(self.dirs["transcripts"], f"{video_id}.json")
        if os.path.exists(transcript_path):
            try:
                with open(transcript_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass

        print(f"\n[2/3] Fetching transcript for: {video_id}...")
        try:
            api = YouTubeTranscriptApi()
            try:
                raw_transcript = api.fetch(video_id)
            except Exception:
                transcript_list = api.list(video_id)
                transcript_obj = transcript_list.find_transcript(['en', 'en-US', 'en-GB', 'hi'])
                raw_transcript = transcript_obj.fetch()

            formatted = []
            for item in raw_transcript:
                text = getattr(item, "text", None) if not isinstance(item, dict) else item.get("text")
                start = getattr(item, "start", 0.0) if not isinstance(item, dict) else item.get("start", 0.0)
                duration = getattr(item, "duration", 0.0) if not isinstance(item, dict) else item.get("duration", 0.0)
                if text:
                    formatted.append({
                        "text": text.replace("\n", " ").strip(),
                        "start": float(start),
                        "duration": float(duration)
                    })

            with open(transcript_path, "w", encoding="utf-8") as f:
                json.dump(formatted, f, indent=2, ensure_ascii=False)

            print(f"[OK] Transcript saved: {len(formatted)} snippets ({transcript_path})")
            return formatted
        except Exception as e:
            print(f"[!] No transcript available for video {video_id}: {e}")
            return []

    def get_transcript_window(self, transcript: list, timestamp: float, window_seconds: float = 15.0) -> str:
        """
        Extract dialogue spoken within a time window [timestamp - window, timestamp + window].
        """
        if not transcript:
            return ""

        start_window = max(0.0, timestamp - window_seconds)
        end_window = timestamp + window_seconds

        matching_texts = []
        for item in transcript:
            item_start = item.get("start", 0.0)
            item_end = item_start + item.get("duration", 0.0)

            if item_start <= end_window and item_end >= start_window:
                text = item.get("text", "").strip()
                # Clean bracketed sound effects like [Music] or (cheering)
                clean_text = re.sub(r"\[.*?\]|\(.*?\)", "", text)
                # Clean music notes (e.g. ♪, ♫) and non-ascii symbols
                clean_text = re.sub(r"[^\w\s.,!?'\"-]", " ", clean_text).strip()
                clean_text = re.sub(r"\s+", " ", clean_text)
                if clean_text:
                    matching_texts.append(clean_text)

        return " ".join(matching_texts).strip()

    def extract_frames(self, video_path, video_id, interval_seconds=5):
        print(f"\n[3/3] Extracting frames every {interval_seconds} seconds...")

        frame_dir = os.path.join(self.dirs["frames"], video_id)
        os.makedirs(frame_dir, exist_ok=True)

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print("[ERROR] Could not open video.")
            return

        fps = cap.get(cv2.CAP_PROP_FPS)
        if not fps or fps <= 0:
            print("[ERROR] Could not determine FPS.")
            cap.release()
            return

        frame_interval = max(1, int(fps * interval_seconds))
        count = 0
        saved_count = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if count % frame_interval == 0:
                timestamp = int(count / fps)
                frame_filename = os.path.join(frame_dir, f"frame_{timestamp}s.jpg")
                success = cv2.imwrite(frame_filename, frame)
                if success:
                    saved_count += 1

            count += 1

        cap.release()
        print(f"[OK] Extracted {saved_count} frames to {frame_dir}")


if __name__ == "__main__":
    youtube_url = input("Enter YouTube URL: ").strip()
    extractor = YouTubeFeatureExtractor()
    video_id = extractor.extract_video_id(youtube_url)

    if not video_id:
        print("[ERROR] Invalid YouTube URL.")
    else:
        video_path = extractor.download_video_and_metadata(youtube_url, video_id)
        transcript = extractor.get_transcript(video_id)
        print(f"Transcript sample at 30s: {extractor.get_transcript_window(transcript, 30)}")
        extractor.extract_frames(video_path, video_id, interval_seconds=5)