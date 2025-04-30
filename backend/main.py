from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Move these imports inside the route functions for isolation
# This can prevent failures at startup

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    from assemblyai_utils import transcribe_audio
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    transcript = transcribe_audio(file_path)
    return {"transcript": transcript}

@app.post("/summarize")
async def summarize(text: str = Form(...)):
    try:
        from summarizer import summarize_text
        summary = summarize_text(text)
        return {"summary": summary}
    except ImportError as e:
        return {"error": f"Failed to load summarizer: {str(e)}"}

@app.post("/process")
async def full_pipeline(file: UploadFile = File(...)):
    try:
        from assemblyai_utils import transcribe_audio
        from summarizer import summarize_text
        
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)   
            
        transcript = transcribe_audio(file_path)
        summary = summarize_text(transcript)
        
        return {
            "transcript": transcript,
            "summary": summary
        }
    except ImportError as e:
        return {"error": f"Failed to load dependencies: {str(e)}"}





