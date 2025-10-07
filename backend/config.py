"""
Configuration file for SpeakScribe backend
Optimized for Apple Silicon M4 (CPU-optimized for stability)
"""
import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
MODELS_DIR = BASE_DIR / "models"

# Create directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

# Cache directories (use system cache)
HOME_DIR = Path.home()
WHISPER_CACHE_DIR = HOME_DIR / ".cache" / "whisper"
GPT4ALL_CACHE_DIR = HOME_DIR / ".cache" / "gpt4all"

# Ensure cache directories exist
WHISPER_CACHE_DIR.mkdir(parents=True, exist_ok=True)
GPT4ALL_CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Model configurations
WHISPER_MODEL_SIZE = "base"  # Options: tiny, base, small, medium, large (using base for better accuracy)
# Using the model already in cache: orca-mini-3b-gguf2-q4_0.gguf
GPT4ALL_MODEL_NAME = "orca-mini-3b-gguf2-q4_0.gguf"  # Already in cache, fast for M4

# Processing settings
MAX_FILE_SIZE_MB = 100
ALLOWED_AUDIO_FORMATS = [".mp3", ".wav", ".m4a", ".flac", ".ogg", ".webm"]

# Sentiment thresholds
SENTIMENT_THRESHOLD_POSITIVE = 0.05
SENTIMENT_THRESHOLD_NEGATIVE = -0.05

# Server settings
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
