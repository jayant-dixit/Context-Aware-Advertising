import glob
import os
from dotenv import load_dotenv
load_dotenv()

from vision_analyzer import analyze_frame

frames = glob.glob("data/frames/**/*.jpg", recursive=True)
if frames:
    IMAGE_PATH = frames[0]
else:
    IMAGE_PATH = "data/frames/kTJczUoc26U/frame_104s.jpg"

print(f"Testing with image: {IMAGE_PATH}")
result = analyze_frame(IMAGE_PATH)

print("\n" + "=" * 30)
print("FINAL RESULT")
print("=" * 30)
print("Scene:", result["scene"])
print("Query:", result["search_query"])