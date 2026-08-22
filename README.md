# Context-Aware Advertising System

An AI-powered contextual advertising system that analyzes images, extracts visual context, and helps identify relevant advertisements based on the detected scene, objects, activities, and other contextual information.

## Project Structure

```text
Context-Aware-Advertising/
│
├── backend/
│   ├── requirements.txt
│   └── ...
│
└── frontend/
    ├── package.json
    └── ...
```

## Prerequisites

Make sure you have the following installed:

* Python 3.10+
* Node.js and npm
* Git

---

# Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment



**Windows CMD:**

```cmd
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

```bash
python pinecone_ads.py
```

### 4. Run Backend Server

Start the FastAPI backend using Uvicorn:

```bash
uvicorn main:app --reload
```

The backend will start in development mode.

---

# Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

### 1. Install Dependencies

```bash
npm i
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend development server will start and provide a local URL in the terminal.

---

# Running the Complete Project

You need **two terminals** running simultaneously.

### Terminal 1 — Backend

```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm i
npm run dev
```

---

## Tech Stack

### Backend

* Python
* FastAPI
* Uvicorn
* AI/ML models
* REST APIs

### Frontend

* React
* JavaScript
* Vite
* npm

---

## Development Workflow

```text
User uploads image
        ↓
Frontend
        ↓
Backend API
        ↓
Visual Context Analysis
        ↓
Context Extraction
        ↓
Advertisement Matching
        ↓
Relevant Advertisement
        ↓
Frontend Display
```

## Notes

* Always activate the Python virtual environment before running the backend.
* Keep the backend and frontend running in separate terminals during development.
* If dependencies change, update `requirements.txt` for the backend and `package.json` for the frontend.
