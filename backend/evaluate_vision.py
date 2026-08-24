import glob
import os
import time

from vision_analyzer import analyze_frame  #[cite: 5]
from eval_metrics import get_semantic_similarity

EXPECTED_SCENES = {
    "frame_0s.jpg": "Dark screen displaying white text Deloitte Hiring 2027",
    "frame_103s.jpg": "Black background listing Deloitte analyst and assistant roles",
    "frame_228s.jpg": "Dark screen with red handwritten notes and assessment menu options",
    "frame_311s.jpg": "Windows start menu displaying pinned apps",
    "frame_424s.jpg": "Computer desktop with pinned productivity apps and open window"
}

def evaluate_qwen_accuracy():
    print("=" * 60)
    print("👁️ QWEN3-VL SEMANTIC ACCURACY EVALUATION")
    print("=" * 60)
    
    frame_files = glob.glob("data/frames/**/*.jpg", recursive=True) #[cite: 4]
    
    if not frame_files:
        print("❌ No frames found! Run your extractor first.")
        return

    print(f"[*] Found {len(frame_files)} frames. Evaluating...\n")
    
    total_score = 0.0
    processed = 0

    for frame_path in frame_files[:5]:
        filename = os.path.basename(frame_path)
        expected_scene = EXPECTED_SCENES.get(filename, "A professional business or tech presentation screen")
        
        print(f"--- Testing Frame: {filename} ---")
        start_time = time.time()
        
        try:
            result = analyze_frame(frame_path) #[cite: 5]
            qwen_scene = result.get("scene", "")
            
            score = get_semantic_similarity(expected_scene, qwen_scene)
            total_score += score
            processed += 1
            
            print(f"Expected : {expected_scene}")
            print(f"Qwen     : {qwen_scene}")
            print(f"Accuracy : {score * 100:.2f}%")
            
            if score >= 0.70:
                print("✅ PASSED: Context accurately understood!")
            else:
                print("⚠️ FAILED: Model hallucinated or missed context.")
                
        except Exception as e:
            print(f"❌ Error processing {filename}: {e}")
            
        print(f"Latency  : {time.time() - start_time:.2f} seconds\n")

    if processed > 0:
        avg_accuracy = (total_score / processed) * 100
        print("=" * 60)
        print(f"📊 FINAL QWEN VISION ACCURACY: {avg_accuracy:.2f}%")
        print("=" * 60)

if __name__ == "__main__":
    evaluate_qwen_accuracy()