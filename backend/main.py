"""
Main FastAPI application for SpeakScribe
Handles audio processing, transcription, sentiment analysis, and more
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from contextlib import asynccontextmanager
import shutil
import os
import logging
from pathlib import Path
from typing import Optional
import asyncio

from config import (
    UPLOAD_DIR, 
    CORS_ORIGINS, 
    WHISPER_MODEL_SIZE, 
    GPT4ALL_MODEL_NAME,
    WHISPER_CACHE_DIR,
    GPT4ALL_CACHE_DIR
)
from services.whisper_service import get_whisper_service
from services.llm_service import get_llm_service
from services.sentiment_service import get_sentiment_service
from services.export_service import get_export_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def ensure_nltk_data():
    """Ensure NLTK data is downloaded for TextBlob/sentiment analysis"""
    try:
        import nltk
        required_packages = ['punkt', 'averaged_perceptron_tagger', 'brown', 'wordnet']
        
        for package in required_packages:
            try:
                nltk.data.find(f'tokenizers/{package}' if package == 'punkt' else 
                             f'taggers/{package}' if 'tagger' in package else 
                             f'corpora/{package}')
            except LookupError:
                logger.info(f"📥 Downloading NLTK package: {package}")
                nltk.download(package, quiet=True)
        
        logger.info("✅ NLTK data ready")
    except Exception as e:
        logger.warning(f"⚠️  NLTK data check failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown"""
    # Startup
    logger.info("🚀 Starting SpeakScribe API...")
    logger.info(f"Whisper cache: {WHISPER_CACHE_DIR}")
    logger.info(f"GPT4All cache: {GPT4ALL_CACHE_DIR}")
    logger.info("Initializing AI services (this may take a moment)...")
    
    # Ensure NLTK data is available
    ensure_nltk_data()
    
    # Create upload directory
    UPLOAD_DIR.mkdir(exist_ok=True)
    
    # Pre-load models to avoid delays on first request
    try:
        get_whisper_service(WHISPER_MODEL_SIZE, cache_dir=str(WHISPER_CACHE_DIR))
        get_sentiment_service()
        logger.info("✅ Services initialized successfully!")
    except Exception as e:
        logger.error(f"❌ Error initializing services: {str(e)}")
    
    yield
    
    # Shutdown (if needed)
    logger.info("🛑 Shutting down SpeakScribe API...")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="SpeakScribe API",
    description="AI-powered meeting transcription and analysis",
    version="2.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SpeakScribe API",
        "version": "2.0.0"
    }


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file using Whisper
    
    Returns:
        - transcript: Full text transcription
        - language: Detected language
        - segments: Time-stamped segments
    """
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Processing audio: {file.filename}")
        
        # Transcribe using Whisper
        whisper_service = get_whisper_service()
        result = whisper_service.transcribe(str(file_path))
        
        return {
            "transcript": result["text"],
            "language": result["language"],
            "segments": result["segments"][:20]  # Limit segments for response size
        }
        
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sentiment")
async def analyze_sentiment(text: str = Form(...)):
    """
    Analyze sentiment of text
    
    Returns:
        - overall_sentiment: positive/negative/neutral
        - sentiment_scores: Detailed scores
        - distribution: Sentiment distribution
    """
    try:
        sentiment_service = get_sentiment_service()
        result = sentiment_service.get_overall_sentiment(text)
        
        return result
        
    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/actions")
async def extract_actions(text: str = Form(...)):
    """
    Extract action items, decisions, and deadlines
    
    Returns:
        - action_items: List of action items
        - decisions: List of decisions
        - deadlines: List of deadlines
    """
    try:
        # Initialize LLM service (will load from cache)
        llm_service = get_llm_service(GPT4ALL_MODEL_NAME, model_path=str(GPT4ALL_CACHE_DIR))
        result = llm_service.extract_action_items(text)
        
        return result
        
    except Exception as e:
        logger.error(f"Action extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/topics")
async def extract_topics(text: str = Form(...)):
    """
    Extract key topics from text
    
    Returns:
        - topics: List of main topics discussed
    """
    try:
        llm_service = get_llm_service(GPT4ALL_MODEL_NAME, model_path=str(GPT4ALL_CACHE_DIR))
        topics = llm_service.extract_topics(text)
        
        return {"topics": topics}
        
    except Exception as e:
        logger.error(f"Topic extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summarize")
async def summarize_text(
    text: str = Form(...),
    style: str = Form("concise")
):
    """
    Summarize text using GPT4All
    
    Args:
        text: Text to summarize
        style: Summary style (concise, detailed, executive)
    
    Returns:
        - summary: Generated summary
    """
    try:
        llm_service = get_llm_service(GPT4ALL_MODEL_NAME, model_path=str(GPT4ALL_CACHE_DIR))
        summary = llm_service.summarize(text, style)
        
        return {"summary": summary}
        
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process")
async def full_pipeline(file: UploadFile = File(...)):
    """
    Complete processing pipeline:
    1. Transcribe audio (Whisper)
    2. Analyze sentiment
    3. Extract action items
    4. Extract topics
    5. Generate summary
    
    Returns complete analysis
    """
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"🎙️ Starting full pipeline for: {file.filename}")
        
        # Step 1: Transcribe
        logger.info("📝 Step 1/5: Transcribing audio...")
        whisper_service = get_whisper_service()
        transcription = whisper_service.transcribe(str(file_path))
        transcript_text = transcription["text"]
        
        # Step 2: Sentiment Analysis
        logger.info("😊 Step 2/5: Analyzing sentiment...")
        sentiment_service = get_sentiment_service()
        sentiment = sentiment_service.get_overall_sentiment(transcript_text)
        
        # Add segment-level sentiment
        segments_with_sentiment = sentiment_service.analyze_segments(
            transcription["segments"][:20]
        )
        
        # Step 3: Initialize LLM (if not already loaded)
        logger.info("🤖 Step 3/5: Initializing LLM...")
        llm_service = get_llm_service(GPT4ALL_MODEL_NAME, model_path=str(GPT4ALL_CACHE_DIR))
        
        # Step 4: Extract action items
        logger.info("📋 Step 4/5: Extracting action items...")
        actions = llm_service.extract_action_items(transcript_text)
        
        # Step 5: Extract topics
        logger.info("🏷️ Step 5/5: Extracting topics...")
        topics = llm_service.extract_topics(transcript_text)
        
        # Step 6: Generate summary
        logger.info("📄 Generating summary...")
        summary = llm_service.summarize(transcript_text, style="concise")
        
        logger.info("✅ Pipeline completed successfully!")
        
        return {
            "transcript": transcript_text,
            "language": transcription["language"],
            "segments": segments_with_sentiment,
            "sentiment": sentiment,
            "actions": {
                "action_items": actions.get("action_items", []),
                "decisions": actions.get("decisions", []),
                "deadlines": actions.get("deadlines", [])
            },
            "topics": topics,
            "summary": summary,
            "speaker_segments": whisper_service.get_speaker_segments(
                transcription["segments"][:20]
            )
        }
        
    except Exception as e:
        logger.error(f"❌ Pipeline error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export/pdf")
async def export_pdf(data: dict):
    """
    Export analysis to PDF
    
    Returns PDF file
    """
    try:
        export_service = get_export_service()
        filepath = export_service.generate_pdf(data)
        
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=Path(filepath).name
        )
        
    except Exception as e:
        logger.error(f"PDF export error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export/docx")
async def export_docx(data: dict):
    """
    Export analysis to DOCX
    
    Returns DOCX file
    """
    try:
        export_service = get_export_service()
        filepath = export_service.generate_docx(data)
        
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=Path(filepath).name
        )
        
    except Exception as e:
        logger.error(f"DOCX export error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",  # Use import string for reload to work
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
