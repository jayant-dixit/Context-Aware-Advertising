<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:6366f1,100:a855f7&amp;height=200&amp;section=header&amp;text=ContextAds&amp;fontSize=60&amp;fontColor=ffffff&amp;animation=fadeIn&amp;fontAlignY=38&amp;desc=AI-Powered%20Context-Aware%20Advertising%20System&amp;descAlignY=58&amp;descSize=20"/>

<p>
  <img src="https://img.shields.io/badge/Python-3.10+-FFD43B?style=for-the-badge&amp;logo=python&amp;logoColor=black"/>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&amp;logo=fastapi&amp;logoColor=white"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&amp;logo=react&amp;logoColor=black"/>
  <img src="https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&amp;logoColor=white"/>
  <img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&amp;logo=huggingface&amp;logoColor=black"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Live%20Demo-contextads.vercel.app-6366f1?style=for-the-badge&amp;logo=vercel&amp;logoColor=white"/>
</p>

**[🌐 Live Demo](https://contextads.vercel.app)**

</div>

---

## 🧠 What is ContextAds?

ContextAds is an **AI-powered contextual advertising engine** that understands the visual content of an image or video and serves the most relevant advertisements — without relying on user data or cookies.

Instead of tracking users, it tracks **context**.

```
User uploads Image / YouTube URL
           ↓
   Scene Detection + Frame Extraction
           ↓
   Vision-Language Model (Qwen) Analysis
           ↓
   Context Extraction (objects, activities, environment)
           ↓
   Pinecone Vector DB — Semantic Ad Matching
           ↓
   Most Relevant Advertisements Returned
           ↓
   Displayed on Frontend
```

---

## ✨ Features

- 🖼️ **Image Upload** — Upload any image and get context-matched ads instantly
- 🎥 **YouTube Video Analysis** — Paste a YouTube URL, extract keyframes, analyze scenes
- 🔍 **Vision AI** — Qwen Vision-Language Model understands scene, objects, and activities
- 🧲 **Semantic Ad Matching** — Pinecone vector database finds the closest matching ads
- 📊 **Evaluation Metrics** — Built-in accuracy evaluation for ad relevance scoring
- ⚡ **Fast API Backend** — Async FastAPI with background job processing

---

## 🏗️ Project Structure

```text
Context-Aware-Advertising/
│
├── backend/
│   ├── main.py                  ← FastAPI app entry point
│   ├── analysis_service.py      ← Core context extraction logic
│   ├── vision_analyzer.py       ← Qwen VLM integration
│   ├── scene_detector.py        ← PySceneDetect keyframe extraction
│   ├── youtube_extractor.py     ← YouTube frame downloader
│   ├── pinecone_ads.py          ← Pinecone vector DB + ad matching
│   ├── eval_metrics.py          ← Ad relevance evaluation
│   ├── evaluate_vision.py       ← Vision model evaluation
│   ├── requirements.txt
│   ├── .env.example
│   ├── .gitignore
│   └── data/                    ← Sample ad data
│
└── frontend/
    ├── src/
    ├── package.json
    └── ...
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, JavaScript |
| **Backend** | Python, FastAPI, Uvicorn |
| **Vision AI** | Qwen VLM (HuggingFace) |
| **Vector DB** | Pinecone |
| **Video Processing** | PySceneDetect, YouTube Extractor |
| **Deployment** | Vercel (Frontend) |

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.10+
- Node.js and npm
- Git
- Pinecone API Key
- HuggingFace Token

---

### Backend Setup

```bash
cd backend
```

**1. Create and activate virtual environment**

```bash
python -m venv venv
```

Windows:
```bash
venv\Scripts\activate
```

Mac/Linux:
```bash
source venv/bin/activate
```

**2. Install dependencies**

```bash
pip install -r requirements.txt
```

**3. Configure environment variables**

```bash
cp .env.example .env
# Add your Pinecone API key and HuggingFace token
```

**4. Load ad data into Pinecone**

```bash
python pinecone_ads.py
```

**5. Start backend server**

```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

### Running Both Together

| Terminal | Command |
|----------|---------|
| Terminal 1 — Backend | `cd backend` → `venv\Scripts\activate` → `uvicorn main:app --reload` |
| Terminal 2 — Frontend | `cd frontend` → `npm run dev` |

---

## 🔑 Environment Variables

Create a `.env` file in `/backend` using `.env.example`:

```env
PINECONE_API_KEY=your_pinecone_api_key
HUGGINGFACE_TOKEN=your_huggingface_token
```

---

## 🚀 How It Works

**Step 1 — Input**
User uploads an image or provides a YouTube video URL via the React frontend.

**Step 2 — Frame Extraction**
For videos, `youtube_extractor.py` downloads the video and `scene_detector.py` extracts the most relevant keyframes using PySceneDetect.

**Step 3 — Vision Analysis**
`vision_analyzer.py` sends frames to the **Qwen Vision-Language Model** which returns a detailed description — objects, people, activities, environment, mood.

**Step 4 — Context Extraction**
`analysis_service.py` processes the model output and structures it into a clean context vector.

**Step 5 — Ad Matching**
`pinecone_ads.py` performs a **semantic similarity search** on the Pinecone vector database and returns the top matching advertisements.

**Step 6 — Display**
Results are returned to the React frontend and displayed to the user.

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze/image` | Analyze uploaded image |
| `POST` | `/analyze/youtube` | Analyze YouTube video URL |
| `GET` | `/health` | Backend health check |

Full interactive docs available at `http://localhost:8000/docs`

---

