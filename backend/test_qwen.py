from ollama import chat


IMAGE_PATH = "data/frames/QPsxAUZLQ3c/frame_50s.jpg"

prompt = """
Analyze this image for contextual advertising.

Return exactly:

SCENE: <short description>

QUERY: <5 to 12 words useful for finding a relevant advertisement>

Focus on:
- objects
- activity
- environment
- products
- lifestyle
- context

Do not explain your reasoning.
Do not return JSON.
Do not use markdown.
"""


response = chat(
    model="qwen3-vl:8b",

    messages=[
        {
            "role": "user",

            "content": prompt,

            "images": [
                IMAGE_PATH
            ]
        }
    ],

    options={
        "temperature": 0
    }
)


print("\n========== QWEN OUTPUT ==========\n")

print(
    response.message.content
)