from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

# Try to load .env for local development (optional in production)
try:
    from dotenv import load_dotenv
    from pathlib import Path
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass  # dotenv not installed in production

app = FastAPI(title="Torch AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_methods=["POST"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


class PromptRequest(BaseModel):
    prompt: str


@app.post("/recommend")
async def recommend(body: PromptRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured.")

    payload = {
        "contents": [{"parts": [{"text": body.prompt}]}]
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Gemini API error: {response.text}",
        )

    data = response.json()

    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        raise HTTPException(status_code=500, detail="Unexpected Gemini response format.")

    return {"text": text}


@app.get("/")
async def root():
    return {"message": "Torch AI API is running", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "ok"}


# Vercel requires the app to be named 'app' or 'handler'
handler = app
