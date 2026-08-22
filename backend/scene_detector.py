from pathlib import Path
import cv2
from scenedetect import detect, ContentDetector, SceneManager, open_video


def detect_video_scenes(video_path: str, threshold: float = 27.0):
    """
    Detect scene transitions directly in a video file using PySceneDetect.
    
    Returns a list of (start_seconds, end_seconds) tuples for each scene.
    """
    scene_list = detect(str(video_path), ContentDetector(threshold=threshold))
    return [(scene[0].get_seconds(), scene[1].get_seconds()) for scene in scene_list]


def get_timestamp(frame_path) -> int:
    """
    Extract timestamp from filename (e.g. 'frame_25s.jpg' -> 25).
    """
    name = Path(frame_path).stem
    return int(name.replace("frame_", "").replace("s", ""))


def select_scene_frames(frame_files, threshold: float = 27.0, min_gap_seconds: int = 10):
    """
    Select representative key frames from a sequence of frame files
    using PySceneDetect content change metrics and a minimum time gap cooldown.
    """
    if not frame_files:
        return []

    selected = []
    last_timestamp = -999
    prev_frame = None

    for frame_path in frame_files:
        timestamp = get_timestamp(frame_path)
        frame = cv2.imread(str(frame_path))
        if frame is None:
            continue

        # Always select the first frame of the chunk
        if prev_frame is None:
            selected.append(frame_path)
            prev_frame = frame
            last_timestamp = timestamp
            continue

        # Compare color space delta (HSV) matching PySceneDetect ContentDetector method
        hsv_prev = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2HSV)
        hsv_curr = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        score = float(cv2.absdiff(hsv_prev, hsv_curr).mean())

        # Scene change detected if score exceeds threshold and cooldown has passed
        if score >= threshold and (timestamp - last_timestamp >= min_gap_seconds):
            print(f"⭐ Scene change detected at {timestamp}s (score: {score:.2f})")
            selected.append(frame_path)
            prev_frame = frame
            last_timestamp = timestamp

    return selected