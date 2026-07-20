from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from services.parser import extract_text_from_pdf
from services.gemini import analyze_resume

app = FastAPI(title="AI Placement Mentor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI Placement Mentor Backend Running 🚀"
    }


@app.post("/analyze")
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