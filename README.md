# Buen Dia App

A hybrid application featuring a modern React frontend and a Python FastAPI backend.

## Architecture

```
Buen_dia_app/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── api/
│   │   │   └── endpoints/
│   │   │       ├── habits.py    # GET/POST /api/habits
│   │   │       └── deepseek.py  # POST /api/deepseek
│   │   ├── schemas/
│   │   │   ├── habit.py         # Pydantic models for habits
│   │   │   └── deepseek.py      # Pydantic models for AI requests
│   │   └── services/
│   │       ├── habit_service.py  # JSON persistence logic
│   │       └── deepseek_service.py # DeepSeek AI integration
│   ├── data/
│   │   ├── data_storage.json    # Habit tracker data
│   │   └── .env                 # API keys (DEEPSEEK_API_KEY)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main app with routing
│   │   ├── App.css              # Global styles
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Habits.tsx       # Habit tracker grid
│   │       ├── DeepSeek.tsx     # AI chat interface
│   │       ├── FunFacts.tsx
│   │       └── Plots.tsx
│   ├── src-tauri/               # Tauri desktop app config
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Quick Start

### 1. Start the Backend (Python API)

```bash
# From the project root (one level above Buen_dia_app/)
source venv/bin/activate

cd Buen_dia_app/backend
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Docs at `http://localhost:8000/docs`.

### 2. Start the Frontend (React)

**As a web app (browser):**
```bash
cd Buen_dia_app/frontend
npm install
npm run dev
```
Opens at `http://localhost:1420`.

**As a native desktop app (requires Rust):**
```bash
cd Buen_dia_app/frontend
npm install
npm run tauri dev
```

## API Endpoints

| Method | Endpoint          | Description                    |
|--------|-------------------|--------------------------------|
| GET    | `/api/habits`     | Load habit tracker data        |
| POST   | `/api/habits`     | Save habit tracker data        |
| POST   | `/api/deepseek`   | Query DeepSeek AI              |
| GET    | `/`               | Health check                   |
