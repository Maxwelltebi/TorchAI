# Torch AI — CIReN Career Path Selector

AI-powered career path selector for CIReN (Campus Innovation & Research Network) students.

## Project Structure

```
torch-ai/
├── frontend/               # Static HTML/CSS/JS
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── main.js         # UI logic & question flow
│       ├── api.js          # Calls FastAPI backend
│       └── kits.js         # All 23 career kit definitions
└── backend/                # FastAPI server (Gemini proxy)
    ├── main.py
    ├── requirements.txt
    ├── .env                # ← create this locally (gitignored)
    └── .env.example        # ← template
```

## Local Setup

### 1. Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Set up your environment variables
cp .env.example .env
# Open .env and paste your Gemini API key
```

Start the backend:
```bash
uvicorn main:app --reload
```
Backend runs at → http://localhost:8000

### 2. Frontend

In a second terminal, simply open `frontend/index.html` in your browser:
```bash
# Mac
open frontend/index.html

# Windows
start frontend/index.html

# Or just drag the file into your browser
```

## Getting a Gemini API Key (Free)

1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click **Get API key** → **Create API key**
4. Copy the key into `backend/.env`

## Deploying

- **Frontend** → Netlify, GitHub Pages, or any static host
- **Backend** → Railway, Render, or any Python host
- Update `API_BASE` in `frontend/js/api.js` to your deployed backend URL before going live

## Replacing Career Kit Links

In `frontend/js/kits.js`, search for `DUMMY_LINK_` and replace each value with the actual Google Doc URL for that kit.
