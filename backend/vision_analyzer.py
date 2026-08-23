import base64
import json
import os
import re
import time
from pathlib import Path

from dotenv import load_dotenv
from huggingface_hub import InferenceClient

from pinecone_ads import search_ads

load_dotenv()

TOP_K_ADS = int(os.getenv("TOP_K_ADS", "3"))


def get_model_and_provider():
    """
    Parse model ID and provider cleanly.
    Supports both:
      HF_MODEL="Qwen/Qwen3-VL-235B-A22B-Instruct:novita"
      AND
      HF_MODEL="Qwen/Qwen3-VL-235B-A22B-Instruct" + HF_PROVIDER="novita"
    """
    raw_model = os.getenv("HF_MODEL", "Qwen/Qwen3-VL-235B-A22B-Instruct:novita").strip()
    env_provider = os.getenv("HF_PROVIDER", "").strip()

    if ":" in raw_model:
        model_id, provider = raw_model.split(":", 1)
        return model_id.strip(), provider.strip()

    return raw_model, (env_provider or "novita")


def get_hf_client() -> InferenceClient:
    """
    Get or create Hugging Face Inference Client with proper provider.
    """
    token = os.getenv("HF_TOKEN")
    if not token:
        raise RuntimeError("HF_TOKEN is missing from your .env file.")

    _, provider = get_model_and_provider()
    if provider:
        return InferenceClient(provider=provider, api_key=token)
    return InferenceClient(api_key=token)


def image_to_data_url(image_path: str) -> str:
    path = Path(image_path)
    extension = path.suffix.lower()

    mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp"
    }

    mime_type = mime_types.get(extension, "image/jpeg")

    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        encoded = base64.b64encode(image_file.read()).decode("utf-8")
    return f"data:image/jpeg;base64,{encoded}"


def analyze_frame(image_path: str, max_retries: int = 3):
    image_data_url = image_to_data_url(image_path)

    prompt = """You are an expert AI advertising strategist. Analyze this video frame for contextual advertisement placement.

Return EXACTLY two lines in this format:
SCENE: <concise 1-sentence description of the visual scene>
QUERY: <6 to 12 high-intent commercial keywords for ad targeting>

Guidelines for QUERY:
- Focus on high-intent commercial terms, products, apparel, electronics, beverages, food, gear, and lifestyle themes.
- Avoid generic filler words (do NOT use words like: 'person', 'indoors', 'walking', 'standing', 'looking', 'shouting').
- Target concrete categories like: streetwear, hoodie, music streaming, headphones, sneakers, energy drink, fast food, gaming, fitness.
- Do NOT output brand names unless clearly printed and legible.
- Do NOT output JSON, markdown, or conversational text.

Example:
SCENE: Man wearing athletic wear stretching near a running track
QUERY: sportswear running shoes athletic apparel fitness gym workout energy drink

Example:
SCENE: Group of young friends enjoying pizza around a table
QUERY: pizza food delivery fast food soft drinks casual dining friends restaurant

Example:
SCENE: Young musician singing in a hoodie under neon lights
QUERY: hoodie streetwear urban fashion music streaming audio headphones youth apparel sneakers
"""

    model_id, _ = get_model_and_provider()
    last_error = None

    for attempt in range(1, max_retries + 1):
        try:
            client = get_hf_client()
            response = client.chat.completions.create(
                model=model_id,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_data_url
                                }
                            }
                        ]
                    }
                ],
                max_tokens=200,
                temperature=0
            )

            raw_output = response.choices[0].message.content.strip()

            print("\nDEBUG HUGGING FACE OUTPUT:")
            print(raw_output)

            # Remove thinking blocks
            raw_output = re.sub(
                r"<think>.*?</think>",
                "",
                raw_output,
                flags=re.DOTALL | re.IGNORECASE
            ).strip()

            # Extract scene
            scene_match = re.search(
                r"SCENE\s*:\s*(.+)",
                raw_output,
                flags=re.IGNORECASE
            )

            # Extract query
            query_match = re.search(
                r"QUERY\s*:\s*(.+)",
                raw_output,
                flags=re.IGNORECASE
            )

            scene = scene_match.group(1).strip() if scene_match else ""

            if query_match:
                query = query_match.group(1).strip()
            else:
                query = raw_output

            query = query.strip("\"'")

            return {
                "scene": scene,
                "search_query": query
            }

        except Exception as exc:
            last_error = exc
            print(f"[!] Vision attempt {attempt}/{max_retries} failed: {exc}")
            if attempt < max_retries:
                time.sleep(2 * attempt)

    print(f"[X] Hugging Face vision failed after {max_retries} attempts: {last_error}")
    raise last_error


def analyze_frame_and_find_ads(image_path: str):
    print("\n" + "=" * 70)
    print(f"[*] Processing frame: {Path(image_path).name}")

    context = analyze_frame(image_path)
    scene = context.get("scene", "")
    search_query = context.get("search_query", "")

    print("\n[VISION ANALYSIS]")
    print("-" * 70)
    print(f"Scene: {scene}")
    print(f"Search Query: {search_query}")

    print("\n[*] SEARCHING AD DATABASE...")
    results = search_ads(search_query, top_k=TOP_K_ADS)

    print("\n[RELEVANT ADVERTISEMENTS]")
    print("-" * 70)

    if not results or not results.result.hits:
        print("No relevant advertisements found.")
        return {
            "scene": scene,
            "search_query": search_query,
            "ads": []
        }

    hits = results.result.hits

    for rank, hit in enumerate(hits, start=1):
        fields = hit.fields
        print(f"\n{rank}. {fields.get('brand', 'Unknown')}")
        print(f"   Title: {fields.get('title', '')}")
        print(f"   Category: {fields.get('category', '')}")
        print(f"   Similarity: {hit.score:.4f}")
        print(f"   Description: {fields.get('description', '')}")

    return {
        "scene": scene,
        "search_query": search_query,
        "ads": hits
    }


def analyze_frames_batch(image_paths, max_retries: int = 3):
    """
    Analyze multiple selected frames in ONE Qwen vision request.

    Returns:
    [
        {
            "frame_index": 0,
            "scene": "...",
            "search_query": "..."
        },
        ...
    ]
    """
    if not image_paths:
        return []

    image_contents = []

    for index, image_path in enumerate(image_paths):
        image_data_url = image_to_data_url(str(image_path))

        image_contents.append({
            "type": "text",
            "text": f"FRAME_INDEX: {index}"
        })

        image_contents.append({
            "type": "image_url",
            "image_url": {
                "url": image_data_url
            }
        })

    prompt = """You are an expert AI advertising strategist. Analyze all the video frames provided below for contextual advertisement placement.

Each image has a FRAME_INDEX.

For EVERY frame, return exactly:
FRAME_INDEX: <index>
SCENE: <concise 1-sentence description of the visual scene>
QUERY: <6 to 12 high-intent commercial keywords for ad targeting>

Guidelines for QUERY:
- Focus on high-intent commercial products, fashion/apparel, consumer electronics, beverages, food, gear, and lifestyle services.
- Avoid generic filler words (do NOT use words like: 'person', 'indoors', 'walking', 'standing', 'looking', 'shouting').
- Target concrete categories like: streetwear, hoodie, music streaming, headphones, sneakers, energy drink, fast food, gaming, fitness.
- Do NOT output brand names unless clearly visible and printed.
- Do NOT output JSON, markdown, or conversational text.

Example:
FRAME_INDEX: 0
SCENE: Man cooking with fresh vegetables in modern kitchen
QUERY: groceries cooking cookware kitchen appliances fresh food gourmet recipe

FRAME_INDEX: 1
SCENE: Young musician singing in a hoodie under neon lights
QUERY: hoodie streetwear urban fashion music streaming audio headphones youth apparel

FRAME_INDEX: 2
SCENE: Athlete running on mountain trail in sportswear
QUERY: trail running shoes sportswear fitness hydration outdoor athletic gear
"""

    content = [{"type": "text", "text": prompt}]
    content.extend(image_contents)

    model_id, _ = get_model_and_provider()
    last_error = None

    for attempt in range(1, max_retries + 1):
        try:
            client = get_hf_client()
            response = client.chat.completions.create(
                model=model_id,
                messages=[
                    {
                        "role": "user",
                        "content": content
                    }
                ],
                max_tokens=500,
                temperature=0
            )

            raw_output = response.choices[0].message.content.strip()

            print("\nDEBUG BATCH QWEN OUTPUT")
            print("=" * 70)
            print(raw_output)
            print("=" * 70)

            # Remove thinking blocks if returned
            raw_output = re.sub(
                r"<think>.*?</think>",
                "",
                raw_output,
                flags=re.DOTALL | re.IGNORECASE
            ).strip()

            # Robust block-based frame parser
            results = []
            blocks = re.split(r"(?=FRAME_INDEX\s*:\s*\d+)", raw_output, flags=re.IGNORECASE)

            for block in blocks:
                if not block.strip():
                    continue

                idx_match = re.search(r"FRAME_INDEX\s*:\s*(\d+)", block, flags=re.IGNORECASE)
                if not idx_match:
                    continue

                frame_index = int(idx_match.group(1))

                scene_match = re.search(r"SCENE\s*:\s*([^\n\r]+)", block, flags=re.IGNORECASE)
                scene = scene_match.group(1).strip() if scene_match else ""

                query_match = re.search(r"QUERY\s*:\s*(.+)", block, flags=re.IGNORECASE | re.DOTALL)
                query = query_match.group(1).strip() if query_match else ""
                query = re.split(r"FRAME_INDEX\s*:\s*\d+", query, flags=re.IGNORECASE)[0].strip()
                query = query.replace("\n", " ").strip("\"'")

                if query.lower() in ["none", "n/a", "no visible content"]:
                    query = ""

                results.append({
                    "frame_index": frame_index,
                    "scene": scene,
                    "search_query": query
                })

            results.sort(key=lambda x: x["frame_index"])
            return results

        except Exception as exc:
            last_error = exc
            print(f"[!] Batch vision attempt {attempt}/{max_retries} failed: {exc}")
            if attempt < max_retries:
                time.sleep(5 * attempt)

    print(f"[X] Batch Qwen vision failed after {max_retries} attempts: {last_error}")
    raise last_error