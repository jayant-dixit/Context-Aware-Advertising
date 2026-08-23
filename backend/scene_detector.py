import os
from pathlib import Path
import cv2
from scenedetect import detect, ContentDetector


def get_timestamp(frame_path) -> int:
    """
    Extract timestamp from filename (e.g. 'frame_25s.jpg' -> 25).
    """
    name = Path(frame_path).stem
    return int(name.replace("frame_", "").replace("s", ""))


def detect_video_scenes(video_path: str, threshold: float = 27.0):
    """
    Detect scene transitions directly in a video file using PySceneDetect.
    Returns a list of (start_seconds, end_seconds) tuples for each scene.
    """
    scene_list = detect(str(video_path), ContentDetector(threshold=threshold))
    return [(scene[0].seconds, scene[1].seconds) for scene in scene_list]


def extract_scene_keyframes(
    video_path: str,
    output_dir: str,
    threshold: float = 27.0,
    min_scene_gap_seconds: float = 20.0
) -> list:
    """
    Use PySceneDetect to directly scan the video and extract ONLY keyframes
    at actual scene boundaries. Eliminates saving hundreds of redundant frames.
    """
    os.makedirs(output_dir, exist_ok=True)
    video_path_str = str(video_path)

    cap = cv2.VideoCapture(video_path_str)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video file: {video_path}")
        return []

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_duration = total_frames / fps

    print(f"\n[*] Scanning video for visual scene changes with PySceneDetect...")
    min_frames = max(1, int(fps * min_scene_gap_seconds))

    try:
        scene_list = detect(video_path_str, ContentDetector(threshold=threshold, min_scene_len=min_frames))
        timestamps = [int(scene[0].seconds) for scene in scene_list]
    except Exception as e:
        print(f"[!] PySceneDetect scan fallback ({e}).")
        timestamps = []

    # Ensure 0s intro is included
    if not timestamps or timestamps[0] != 0:
        timestamps = [0] + timestamps

    # If long scenes exist (>120s), add intermediate sample points
    expanded_timestamps = []
    for i, t in enumerate(timestamps):
        expanded_timestamps.append(t)
        next_t = timestamps[i + 1] if i + 1 < len(timestamps) else int(video_duration)
        gap = next_t - t
        if gap > 120:
            for extra in range(t + 90, next_t - 20, 90):
                expanded_timestamps.append(extra)

    unique_timestamps = sorted(set(expanded_timestamps))
    print(f"[OK] Found {len(unique_timestamps)} unique scene keyframes: {unique_timestamps}")

    keyframe_paths = []
    for ts in unique_timestamps:
        cap.set(cv2.CAP_PROP_POS_MSEC, ts * 1000)
        ret, frame = cap.read()
        if ret:
            out_file = Path(output_dir) / f"frame_{ts}s.jpg"
            cv2.imwrite(str(out_file), frame)
            keyframe_paths.append(out_file)

    cap.release()
    print(f"[OK] Extracted {len(keyframe_paths)} keyframes directly to {output_dir}")
    return keyframe_paths


def select_scene_frames(frame_files, threshold: float = 27.0, min_gap_seconds: int = 10):
    """
    Legacy helper for selecting frames from a list of files.
    """
    if not frame_files:
        return []
    return frame_files