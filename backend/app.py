import os
import sys
from pathlib import Path

# Add backend directory and parent directory to sys.path so services can always be imported
BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
for d in [str(BACKEND_DIR), str(ROOT_DIR)]:
    if d not in sys.path:
        sys.path.insert(0, d)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.services.parser import extract_text_from_pdf
    from backend.services.gemini import analyze_resume
except ImportError:
    from services.parser import extract_text_from_pdf
    from services.gemini import analyze_resume

app = FastAPI(
    title="AI Placement Mentor API",
    description="FastAPI Backend for AI Placement Mentor",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
@app.get("/api/py")
@app.get("/api/py/")
def home():
    return {
        "status": "healthy",
        "service": "AI Placement Mentor Backend",
        "message": "AI Placement Mentor Backend Running 🚀"
    }


@app.post("/analyze")
@app.post("/api/py/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        text = extract_text_from_pdf(pdf_bytes)

        if not text.strip():
            return {
                "success": False,
                "message": "No text found in the PDF."
            }

        analysis = analyze_resume(text)

        return {
            "success": True,
            "filename": file.filename,
            "analysis": analysis
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }