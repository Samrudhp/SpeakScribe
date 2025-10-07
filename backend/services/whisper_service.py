"""
Whisper transcription service
Optimized for Apple Silicon M4 using CPU
"""
import whisper
import torch
import os
from pathlib import Path
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class WhisperService:
    def __init__(self, model_size: str = "base", download_root: Optional[str] = None):
        """
        Initialize Whisper model
        
        Args:
            model_size: Model size (tiny, base, small, medium, large)
            download_root: Directory to store/load models from (default: ~/.cache/whisper)
        """
        self.model_size = model_size
        self.device = "cpu"  # Use CPU only for stability
        
        # Set cache directory
        if download_root is None:
            download_root = str(Path.home() / ".cache" / "whisper")
        
        logger.info(f"Loading Whisper {model_size} model on {self.device}...")
        logger.info(f"Using cache directory: {download_root}")
        
        # Load model from cache
        self.model = whisper.load_model(
            model_size, 
            device=self.device,
            download_root=download_root
        )
        logger.info("Whisper model loaded successfully from cache!")
    
    def transcribe(
        self, 
        audio_path: str, 
        language: Optional[str] = None,
        with_timestamps: bool = True
    ) -> Dict:
        """
        Transcribe audio file
        
        Args:
            audio_path: Path to audio file
            language: Language code (e.g., 'en', 'es'). None for auto-detect
            with_timestamps: Include word-level timestamps
            
        Returns:
            Dictionary with transcription results
        """
        try:
            logger.info(f"Transcribing {audio_path}...")
            
            result = self.model.transcribe(
                audio_path,
                language=language,
                word_timestamps=with_timestamps,
                fp16=False  # Set to False for MPS compatibility
            )
            
            return {
                "text": result["text"],
                "segments": result.get("segments", []),
                "language": result.get("language", "unknown"),
            }
            
        except Exception as e:
            logger.error(f"Transcription error: {str(e)}")
            raise
    
    def get_speaker_segments(self, segments: List[Dict]) -> List[Dict]:
        """
        Extract speaker segments with timestamps
        
        Args:
            segments: Whisper segments with timestamps
            
        Returns:
            List of segments with speaker information
        """
        speaker_segments = []
        
        for i, segment in enumerate(segments):
            speaker_segments.append({
                "speaker": f"Speaker {(i % 4) + 1}",  # Simple speaker assignment
                "start": segment.get("start", 0),
                "end": segment.get("end", 0),
                "text": segment.get("text", "")
            })
        
        return speaker_segments


# Singleton instance
_whisper_service = None

def get_whisper_service(model_size: str = "base", cache_dir: Optional[str] = None) -> WhisperService:
    """
    Get or create WhisperService instance
    
    Args:
        model_size: Whisper model size
        cache_dir: Cache directory for models (default: ~/.cache/whisper)
    """
    global _whisper_service
    if _whisper_service is None:
        _whisper_service = WhisperService(model_size, download_root=cache_dir)
    return _whisper_service
