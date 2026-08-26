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

# Hugging Face API token pool.
# Provide ANY number of tokens separated by commas:
# HF_TOKENS=hf_token_1
# HF_TOKENS=hf_token_1,hf_token_2,hf_token_3
# HF_TOKEN is still supported as a fallback for backward compatibility.
# HF_TOKEN_COOLDOWN=60

TOP_K_ADS = int(os.getenv("TOP_K_ADS", "3"))


def get_model_and_provider():
    """
    Parse model ID and provider cleanly.
    Supports both:
      HF_MODEL="Qwen/Qwen2.5-VL-72B-Instruct:together"
      AND
      HF_MODEL="Qwen/Qwen2.5-VL-72B-Instruct" + HF_PROVIDER="together"
      OR default Hugging Face auto provider routing
    """
    raw_model = os.getenv("HF_MODEL", "Qwen/Qwen3-VL-235B-A22B-Instruct:novita").strip()
    env_provider = os.getenv("HF_PROVIDER", "").strip()

    if ":" in raw_model:
        model_id, provider = raw_model.split(":", 1)
        return model_id.strip(), provider.strip()

    return raw_model, (env_provider or None)


class HuggingFaceTokenManager:
    """
    Dynamically manages any number of Hugging Face API tokens.

    Configure tokens in .env as:
        HF_TOKENS=hf_token_1,hf_token_2,hf_token_3

    A single token also works:
        HF_TOKENS=hf_token_1

    Tokens that receive a rate-limit/quota response are put on cooldown
    and skipped until the cooldown expires.
    """

    def __init__(self):
        raw_tokens = os.getenv("HF_TOKENS", "").strip()

        # Backward compatibility with the old single-token setup.
        if not raw_tokens:
            raw_tokens = os.getenv("HF_TOKEN", "").strip()

        self.tokens = [
            token.strip()
            for token in raw_tokens.split(",")
            if token.strip()
        ]

        if not self.tokens:
            raise RuntimeError(
                "No Hugging Face tokens configured. "
                "Set HF_TOKENS=token1,token2,... in your .env file."
            )

        self.current_index = 0
        self.cooldown_until = [0.0] * len(self.tokens)

        # Keep token rotation safe if multiple video/frame jobs run concurrently.
        from threading import Lock
        self._lock = Lock()

        self.cooldown_seconds = max(
            1,
            int(os.getenv("HF_TOKEN_COOLDOWN", "60"))
        )

        print(f"[HF] Loaded {len(self.tokens)} Hugging Face token(s).")

    def get_next_token(self):
        """Return the next currently available token, or None if all are cooling down."""
        now = time.time()

        with self._lock:
            token_count = len(self.tokens)

            for offset in range(token_count):
                index = (self.current_index + offset) % token_count

                if self.cooldown_until[index] <= now:
                    self.current_index = (index + 1) % token_count
                    return index, self.tokens[index]

        return None, None

    def mark_rate_limited(self, index: int, cooldown_seconds: int | None = None):
        """Temporarily remove a rate-limited token from rotation."""
        if index < 0 or index >= len(self.tokens):
            return

        cooldown = (
            cooldown_seconds
            if cooldown_seconds is not None
            else self.cooldown_seconds
        )

        with self._lock:
            self.cooldown_until[index] = time.time() + cooldown

        print(
            f"[HF] Token {index + 1}/{len(self.tokens)} "
            f"rate-limited. Cooling down for {cooldown}s."
        )

    def available_count(self) -> int:
        """Return the number of tokens currently available."""
        now = time.time()

        with self._lock:
            return sum(
                1
                for expiry in self.cooldown_until
                if expiry <= now
            )


HF_TOKEN_MANAGER = HuggingFaceTokenManager()


def get_hf_client(token: str | None = None) -> InferenceClient:
    """
    Create a Hugging Face InferenceClient using the supplied token.
    If no token is supplied, obtain the next available token from the pool.
    """
    if token is None:
        _, token = HF_TOKEN_MANAGER.get_next_token()

    if not token:
        raise RuntimeError(
            "All Hugging Face tokens are currently on cooldown. "
            "Increase HF_TOKEN_COOLDOWN or wait for a token to become available."
        )

    _, provider = get_model_and_provider()

    if provider:
        return InferenceClient(provider=provider, api_key=token)

    return InferenceClient(api_key=token)


def is_hf_rate_limit_error(exc: Exception) -> bool:
    """
    Detect Hugging Face/provider rate-limit or quota errors.

    Handles HTTP-style exceptions as well as SDK exceptions whose message
    contains common rate-limit/quota indicators.
    """
    status_code = getattr(exc, "status_code", None)

    response = getattr(exc, "response", None)
    if response is not None:
        status_code = getattr(response, "status_code", status_code)

    if status_code == 429:
        return True

    message = str(exc).lower()

    rate_limit_terms = (
        "429",
        "too many requests",
        "rate limit",
        "rate-limit",
        "ratelimit",
        "quota exceeded",
        "quota",
        "exhausted",
        "limit exceeded",
        "resource exhausted",
    )

    return any(term in message for term in rate_limit_terms)


def call_hf_with_rotation(request_fn, max_retries: int = 3):
    """
    Execute one Hugging Face request with automatic token rotation.

    request_fn receives an InferenceClient and must perform the actual
    Hugging Face SDK request.

    Rate-limit/quota errors immediately switch to another available token.
    Other errors use normal retry behavior.
    """
    last_error = None
    attempted_tokens = set()

    # We allow each configured token to be tried once in the rotation,
    # plus the caller's normal retries for non-rate-limit failures.
    max_token_attempts = len(HF_TOKEN_MANAGER.tokens)

    for token_attempt in range(max_token_attempts):
        token_index, token = HF_TOKEN_MANAGER.get_next_token()

        if token is None:
            # All tokens are cooling down. Wait for the earliest cooldown
            # instead of failing immediately.
            now = time.time()

            with HF_TOKEN_MANAGER._lock:
                earliest = min(HF_TOKEN_MANAGER.cooldown_until)

            wait_time = max(0.0, earliest - now)

            if wait_time > 0:
                print(
                    f"[HF] All {len(HF_TOKEN_MANAGER.tokens)} token(s) "
                    f"are cooling down. Waiting {wait_time:.1f}s..."
                )
                time.sleep(wait_time)

            token_index, token = HF_TOKEN_MANAGER.get_next_token()

            if token is None:
                raise RuntimeError(
                    "No Hugging Face token became available after cooldown."
                )

        # Prevent accidentally cycling over the same token during this request.
        if token_index in attempted_tokens and len(attempted_tokens) < max_token_attempts:
            continue

        attempted_tokens.add(token_index)

        try:
            client = get_hf_client(token)
            response = request_fn(client)

            print(
                f"[HF] Request succeeded using token "
                f"{token_index + 1}/{len(HF_TOKEN_MANAGER.tokens)}"
            )

            return response

        except Exception as exc:
            last_error = exc

            if is_hf_rate_limit_error(exc):
                HF_TOKEN_MANAGER.mark_rate_limited(token_index)
                print(
                    f"[HF] Switching from token "
                    f"{token_index + 1}/{len(HF_TOKEN_MANAGER.tokens)}..."
                )
                continue

            # Non-rate-limit errors are retried with another available token
            # only when there are retries left.
            print(
                f"[HF] Token {token_index + 1}/{len(HF_TOKEN_MANAGER.tokens)} "
                f"request failed: {exc}"
            )

            if token_attempt + 1 < max_retries:
                time.sleep(2 * (token_attempt + 1))
                continue

            raise

    if last_error:
        raise last_error

    raise RuntimeError("Hugging Face request failed without a captured exception.")


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
            response = call_hf_with_rotation(
                lambda client: client.chat.completions.create(
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
                ),
                max_retries=max_retries
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


def analyze_video_metadata(metadata: dict, max_retries: int = 3) -> dict:
    """
    Analyze YouTube video metadata (Title, Description, Tags, Categories, Channel)
    to identify the global genre/theme and high-intent commercial ad queries.
    Provides rich context for videos with static visuals (e.g. songs, podcasts, tutorials)
    and enables multi-genre ad matching.
    """
    if not metadata:
        return {"theme": "", "search_query": ""}

    title = metadata.get("title", "")
    description = (metadata.get("description") or "")[:1200]
    tags = ", ".join(metadata.get("tags", [])[:15]) if metadata.get("tags") else ""
    categories = ", ".join(metadata.get("categories", [])) if metadata.get("categories") else ""
    channel = metadata.get("channel", "")

    prompt = f"""You are an expert AI advertising strategist. Analyze this YouTube video's metadata to determine its content genre/theme and generate high-intent commercial ad targeting keywords.

Video Information:
- Title: {title}
- Channel: {channel}
- Categories: {categories}
- Tags: {tags}
- Description: {description}

Return EXACTLY two lines in this format:
THEME: <concise 1-sentence description of the video content, format, and genre>
QUERY: <8 to 15 high-intent commercial keywords and product/service categories for ad targeting>

Guidelines for QUERY:
- If this is a Song / Music / Audio / Lyric video: target streaming music apps, songs, audio track, headphones, wireless earbuds, playlists, Spotify, Apple Music, boAt, sound systems, concert tickets.
- If this is a Gaming / Esports video: target gaming laptops, console, PlayStation, Xbox, Discord, gaming headset, mechanical keyboard, energy drinks, gaming mouse.
- If this is a Tech / Coding / Educational tutorial: target online courses, coding platforms, Udemy, Coursera, laptops, cloud services, software development, certifications.
- If this is a Fitness / Workout / Sports video: target gym apparel, running shoes, sportswear, Nike, Adidas, workout supplements, fitness trackers.
- If this is a Cooking / Food video: target food delivery, Zomato, Swiggy, fresh groceries, cookware, snacks, beverages.
- If this is a Travel / Tourism video: target flights, hotels, vacations, MakeMyTrip, Goibibo, Airbnb, travel gear, luggage.
- Focus on commercial products, services, and brands relevant to the viewer's interests.
- Do NOT output conversational text, markdown, or JSON.
"""

    model_id, _ = get_model_and_provider()
    last_error = None

    for attempt in range(1, max_retries + 1):
        try:
            response = call_hf_with_rotation(
                lambda client: client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    max_tokens=250,
                    temperature=0
                ),
                max_retries=max_retries
            )

            raw_output = response.choices[0].message.content.strip()

            # Remove thinking blocks if present
            raw_output = re.sub(
                r"<think>.*?</think>",
                "",
                raw_output,
                flags=re.DOTALL | re.IGNORECASE
            ).strip()

            theme_match = re.search(r"THEME\s*:\s*([^\n\r]+)", raw_output, flags=re.IGNORECASE)
            theme = theme_match.group(1).strip() if theme_match else ""

            query_match = re.search(r"QUERY\s*:\s*(.+)", raw_output, flags=re.IGNORECASE | re.DOTALL)
            query = query_match.group(1).strip() if query_match else ""
            query = query.replace("\n", " ").strip("\"'")

            if not query:
                query = f"{title} {tags} {categories}".strip()

            print(f"\n[METADATA INTELLIGENCE]")
            print(f"   Theme: {theme}")
            print(f"   Query: {query}")

            return {
                "theme": theme,
                "search_query": query
            }

        except Exception as exc:
            last_error = exc
            print(f"[!] Metadata analysis attempt {attempt}/{max_retries} failed: {exc}")
            if attempt < max_retries:
                time.sleep(2 * attempt)

    # Fallback to raw metadata terms if LLM fails
    fallback_query = f"{title} {tags} {categories}".strip()
    return {
        "theme": title,
        "search_query": fallback_query
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
            response = call_hf_with_rotation(
                lambda client: client.chat.completions.create(
                    model=model_id,
                    messages=[
                        {
                            "role": "user",
                            "content": content
                        }
                    ],
                    max_tokens=500,
                    temperature=0
                ),
                max_retries=max_retries
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