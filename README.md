<div align="center">

<picture>
  <img src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,30:302b63,60:6366f1,100:a855f7&height=220&section=header&text=ContextAds&fontSize=80&fontColor=ffffff&animation=twinkling&fontAlignY=50&stroke=6366f1&strokeWidth=2&desc=Contextual%20Intelligence%20for%20Modern%20Advertising&descSize=17&descColor=c4b5fd&descAlignY=68"/>
</picture>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=16&duration=2000&pause=500&color=a855f7&center=true&vCenter=true&width=700&lines=Built+for+the+future+of+advertising...;YouTube+URL+to+Relevant+Ad+in+seconds...;Vision+AI+understands+scene+%2B+objects+%2B+actions...;Pinecone+finds+the+right+ad+at+the+right+moment..." />

<br/>

<a href="https://contextads.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/🚀%20%20Try%20ContextAds%20Live%20%20🚀-Click%20to%20Launch-a855f7?style=for-the-badge&labelColor=0f0c29&logoColor=white" height="40"/>
</a>

<br/><br/>

<table border="0">
<tr>
<td>
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=13&duration=2000&pause=500&color=6366F1&center=true&vCenter=true&multiline=true&width=380&height=80&lines=Vision+AI+%E2%86%92+Context+Extraction;Context+%E2%86%92+Semantic+Search;Semantic+Search+%E2%86%92+Relevant+Ads" />
</td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td align="left">

```text
model   : Qwen Vision-Language Model
vector  : Pinecone Semantic Search  
backend : FastAPI + Python 3.10+
frontend: React + Vite
privacy : zero cookies · zero tracking
```

</td>
</tr>
</table>

<br/>

![Status](https://img.shields.io/badge/STATUS-ACTIVE-22c55e?style=for-the-badge)
&nbsp;
![Privacy](https://img.shields.io/badge/TRACKING-ZERO-ef4444?style=for-the-badge)
&nbsp;
![AI](https://img.shields.io/badge/POWERED%20BY-VISION%20AI-6366f1?style=for-the-badge)

<br/>

<img src="https://img.shields.io/badge/Python-3.10+-FFD43B?style=flat-square&logo=python&logoColor=black"/>
<img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Pinecone-000000?style=flat-square&logoColor=white"/>
<img src="https://img.shields.io/badge/HuggingFace-FFD21E?style=flat-square&logo=huggingface&logoColor=black"/>
<img src="https://img.shields.io/badge/Qwen_VLM-6366f1?style=flat-square&logo=openai&logoColor=white"/>

<br/><br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

</div>

---

## 🧠 What is ContextAds?

ContextAds is an **AI-powered contextual advertising engine** that understands the visual content of an image or video and serves the most relevant advertisements — without relying on user data or cookies.

Instead of tracking users, it tracks **context**.

> **The future of advertising is not about who you are. It's about what you see.**

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

Create a `.env` file inside `/backend` using `.env.example`:

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

Full interactive docs at `http://localhost:8000/docs`

---

<div align="center">

<br/>

### Don't just show ads. Show the *right* ads.

<br/>

<a href="https://contextads.vercel.app" target="_blank">
  <img src="https://img.shields.io/badge/⚡%20%20Launch%20ContextAds%20Now%20%20⚡-Go%20to%20Website-a855f7?style=for-the-badge&labelColor=0f0c29" height="45"/>
</a>

<br/><br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,30:302b63,60:6366f1,100:a855f7&height=120&section=footer&animation=twinkling"/>

</div>
