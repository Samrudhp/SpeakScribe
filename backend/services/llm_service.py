"""
GPT4All LLM service for summarization and text generation
Optimized for Apple Silicon M4
"""
from gpt4all import GPT4All
import logging
import os
from typing import Optional, Dict
from pathlib import Path

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self, model_name: str = "mistral-7b-openorca.Q4_0.gguf", model_path: Optional[str] = None):
        """
        Initialize GPT4All model
        
        Args:
            model_name: GPT4All model name
            model_path: Directory containing the model (default: ~/.cache/gpt4all)
        """
        self.model_name = model_name
        
        # Set model path to cache directory
        if model_path is None:
            model_path = str(Path.home() / ".cache" / "gpt4all")
        
        # Ensure cache directory exists
        Path(model_path).mkdir(parents=True, exist_ok=True)
        
        logger.info(f"Loading GPT4All model: {model_name}...")
        logger.info(f"Using model directory: {model_path}")
        
        try:
            # GPT4All will look for models in model_path directory
            self.model = GPT4All(
                model_name, 
                model_path=model_path,
                device='cpu', 
                allow_download=True
            )
            logger.info("GPT4All model loaded successfully from cache!")
        except Exception as e:
            logger.error(f"Error loading GPT4All model: {str(e)}")
            raise
    
    def generate(
        self, 
        prompt: str, 
        max_tokens: int = 500,
        temperature: float = 0.7
    ) -> str:
        """
        Generate text from prompt
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0.0 to 1.0)
            
        Returns:
            Generated text
        """
        try:
            with self.model.chat_session():
                response = self.model.generate(
                    prompt,
                    max_tokens=max_tokens,
                    temp=temperature
                )
            return response.strip()
        except Exception as e:
            logger.error(f"Generation error: {str(e)}")
            return f"Error generating response: {str(e)}"
    
    def summarize(self, text: str, style: str = "concise") -> str:
        """
        Summarize text using GPT4All
        
        Args:
            text: Text to summarize
            style: Summary style (concise, detailed, executive)
            
        Returns:
            Summary text
        """
        if style == "concise":
            prompt = f"""Summarize the following meeting transcript in a concise manner. 
Focus on key points, decisions, and important discussions.

Transcript:
{text[:3000]}

Summary:"""
        elif style == "detailed":
            prompt = f"""Provide a detailed summary of the following meeting transcript.
Include all important points, discussions, and context.

Transcript:
{text[:3000]}

Detailed Summary:"""
        else:  # executive
            prompt = f"""Create an executive summary of the following meeting transcript.
Focus on high-level decisions, action items, and strategic points.

Transcript:
{text[:3000]}

Executive Summary:"""
        
        return self.generate(prompt, max_tokens=400, temperature=0.5)
    
    def extract_action_items(self, text: str) -> Dict:
        """
        Extract action items, tasks, and decisions
        
        Args:
            text: Meeting transcript
            
        Returns:
            Dictionary with action items, tasks, decisions
        """
        prompt = f"""Analyze the following meeting transcript and extract:
1. Action items (who needs to do what)
2. Decisions made
3. Deadlines mentioned

Format the output as follows:
ACTION ITEMS:
- [List each action item]

DECISIONS:
- [List each decision]

DEADLINES:
- [List each deadline]

Transcript:
{text[:3000]}

Analysis:"""
        
        response = self.generate(prompt, max_tokens=400, temperature=0.3)
        
        # Parse response
        action_items = []
        decisions = []
        deadlines = []
        
        current_section = None
        for line in response.split('\n'):
            line = line.strip()
            if 'ACTION ITEMS' in line.upper():
                current_section = 'actions'
            elif 'DECISIONS' in line.upper():
                current_section = 'decisions'
            elif 'DEADLINES' in line.upper():
                current_section = 'deadlines'
            elif line.startswith('-') or line.startswith('•'):
                item = line.lstrip('-•').strip()
                if item:
                    if current_section == 'actions':
                        action_items.append(item)
                    elif current_section == 'decisions':
                        decisions.append(item)
                    elif current_section == 'deadlines':
                        deadlines.append(item)
        
        return {
            "action_items": action_items,
            "decisions": decisions,
            "deadlines": deadlines,
            "raw_response": response
        }
    
    def extract_topics(self, text: str) -> list:
        """
        Extract key topics and themes
        
        Args:
            text: Meeting transcript
            
        Returns:
            List of key topics
        """
        prompt = f"""Identify the 5-7 main topics discussed in this meeting transcript.
List only the topic names, one per line.

Transcript:
{text[:3000]}

Main Topics:"""
        
        response = self.generate(prompt, max_tokens=200, temperature=0.3)
        
        # Parse topics
        topics = []
        for line in response.split('\n'):
            line = line.strip().lstrip('-•123456789.').strip()
            if line and len(line) < 100:  # Reasonable topic length
                topics.append(line)
        
        return topics[:7]  # Limit to 7 topics


# Singleton instance
_llm_service = None

def get_llm_service(model_name: str = "mistral-7b-openorca.Q4_0.gguf", model_path: Optional[str] = None) -> LLMService:
    """
    Get or create LLMService instance
    
    Args:
        model_name: GPT4All model name
        model_path: Directory containing models (default: ~/.cache/gpt4all)
    """
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService(model_name, model_path=model_path)
    return _llm_service
