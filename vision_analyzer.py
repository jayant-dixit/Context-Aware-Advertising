import base64
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

from pinecone_ads import search_ads


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
VISION_MODEL = os.getenv(
    "GROQ_VISION_MODEL",
    "qwen/qwen3.6-27b"
)

TOP_K_ADS = int(
    os.getenv("TOP_K_ADS", "3")
)


if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is missing from your .env file."
    )


client = Groq(api_key=GROQ_API_KEY)


def encode_image(image_path):
    """
    Convert local image to base64 data URL.
    """

    with open(image_path, "rb") as image_file:

        encoded = base64.b64encode(
            image_file.read()
        ).decode("utf-8")

    return f"data:image/jpeg;base64,{encoded}"

def analyze_frame(image_path):
    """
    Analyze a frame and generate a clean semantic search query.
    """

    image_url = encode_image(image_path)

    prompt = """
Analyze this image for contextual advertising.

We need to understand what type of advertisement would naturally
fit the content shown in the image.

Return EXACTLY these two lines:

SCENE: <short description of the scene>

QUERY: <5 to 12 important words for semantic advertisement search>

Rules for QUERY:
- Describe the context, activity, products, lifestyle or environment.
- Do NOT explain your reasoning.
- Do NOT mention that you are an AI.
- Do NOT write paragraphs.
- Do NOT use JSON.
- Do NOT use markdown.
- Do NOT include <think> tags.
- Do NOT identify a brand unless the brand itself is the main contextual subject.
- Focus on concepts useful for matching advertisements.

Example:

SCENE: Person running outdoors

QUERY: running fitness sports shoes athletic clothing exercise

Another example:

SCENE: Friends eating pizza together

QUERY: pizza food restaurant dinner friends food delivery

Another example:

SCENE: Person drinking coffee in a cafe

QUERY: coffee cafe beverages morning relaxation lifestyle

Return ONLY the two lines.
"""

    response = client.chat.completions.create(
        model=VISION_MODEL,

        messages=[
            {
                "role": "system",
                "content": (
                    "You are a contextual advertising analyzer. "
                    "Follow the requested output format exactly."
                )
            },
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
                            "url": image_url
                        }
                    }
                ]
            }
        ],

        temperature=0,

        max_completion_tokens=200
    )

    raw_output = response.choices[0].message.content.strip()

    print("\nDEBUG GROQ OUTPUT:")
    print(raw_output)

    # Remove accidental think blocks
    raw_output = re.sub(
        r"<think>.*?</think>",
        "",
        raw_output,
        flags=re.DOTALL | re.IGNORECASE
    ).strip()

    # Extract QUERY line
    query_match = re.search(
        r"QUERY\s*:\s*(.+)",
        raw_output,
        flags=re.IGNORECASE
    )

    scene_match = re.search(
        r"SCENE\s*:\s*(.+)",
        raw_output,
        flags=re.IGNORECASE
    )

    if query_match:
        query = query_match.group(1).strip()
    else:
        # Fallback if model doesn't follow format
        query = raw_output

    if scene_match:
        scene = scene_match.group(1).strip()
    else:
        scene = ""

    # Clean accidental quotes
    query = query.strip("\"'")

    return {
        "scene": scene,
        "search_query": query
    }
    
    
def analyze_frame_and_find_ads(image_path):

    print("\n" + "=" * 70)

    print(
        f"🖼️ Processing frame: "
        f"{Path(image_path).name}"
    )

    context = analyze_frame(image_path)

    scene = context.get(
        "scene",
        ""
    )

    search_query = context.get(
        "search_query",
        ""
    )

    print("\n🧠 VISION ANALYSIS")
    print("-" * 70)

    print(
        f"Scene: {scene}"
    )

    print(
        f"Search Query: {search_query}"
    )

    print("\n🔎 SEARCHING AD DATABASE...")

    results = search_ads(
        search_query,
        top_k=TOP_K_ADS
    )

    print("\n📢 RELEVANT ADVERTISEMENTS")
    print("-" * 70)

    hits = results.result.hits

    if not hits:

        print(
            "No relevant advertisements found."
        )

        return {
            "scene": scene,
            "search_query": search_query,
            "ads": []
        }

    for rank, hit in enumerate(
        hits,
        start=1
    ):

        fields = hit.fields

        print(
            f"\n{rank}. "
            f"{fields.get('brand', 'Unknown')}"
        )

        print(
            f"   Title: "
            f"{fields.get('title', '')}"
        )

        print(
            f"   Category: "
            f"{fields.get('category', '')}"
        )

        print(
            f"   Similarity: "
            f"{hit.score:.4f}"
        )

        print(
            f"   Description: "
            f"{fields.get('description', '')}"
        )

    return {
        "scene": scene,
        "search_query": search_query,
        "ads": hits
    }