"""
Sentiment analysis service for meeting transcripts
Analyzes emotional tone and patterns
"""
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class SentimentService:
    def __init__(self):
        """Initialize sentiment analyzer"""
        self.vader = SentimentIntensityAnalyzer()
        logger.info("Sentiment analyzer initialized")
    
    def analyze_text(self, text: str) -> Dict:
        """
        Analyze sentiment of text
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment scores and classification
        """
        # VADER sentiment (better for social media and conversational text)
        vader_scores = self.vader.polarity_scores(text)
        
        # TextBlob sentiment (good for general text)
        blob = TextBlob(text)
        textblob_polarity = blob.sentiment.polarity
        textblob_subjectivity = blob.sentiment.subjectivity
        
        # Overall classification
        compound = vader_scores['compound']
        if compound >= 0.05:
            sentiment = "positive"
            emoji = "😊"
        elif compound <= -0.05:
            sentiment = "negative"
            emoji = "😟"
        else:
            sentiment = "neutral"
            emoji = "😐"
        
        return {
            "sentiment": sentiment,
            "emoji": emoji,
            "compound_score": compound,
            "positive": vader_scores['pos'],
            "neutral": vader_scores['neu'],
            "negative": vader_scores['neg'],
            "polarity": textblob_polarity,
            "subjectivity": textblob_subjectivity
        }
    
    def analyze_segments(self, segments: List[Dict]) -> List[Dict]:
        """
        Analyze sentiment for each segment
        
        Args:
            segments: List of text segments with timestamps
            
        Returns:
            List of segments with sentiment analysis
        """
        results = []
        
        for segment in segments:
            text = segment.get('text', '')
            sentiment = self.analyze_text(text)
            
            results.append({
                **segment,
                "sentiment": sentiment['sentiment'],
                "sentiment_emoji": sentiment['emoji'],
                "sentiment_score": sentiment['compound_score']
            })
        
        return results
    
    def get_overall_sentiment(self, text: str) -> Dict:
        """
        Get comprehensive sentiment analysis
        
        Args:
            text: Full transcript text
            
        Returns:
            Dictionary with overall sentiment metrics
        """
        # Split into sentences for granular analysis
        blob = TextBlob(text)
        sentences = blob.sentences
        
        sentiment_scores = []
        for sentence in sentences[:50]:  # Analyze first 50 sentences
            score = self.vader.polarity_scores(str(sentence))
            sentiment_scores.append(score['compound'])
        
        # Calculate statistics
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0
        positive_count = sum(1 for s in sentiment_scores if s > 0.05)
        negative_count = sum(1 for s in sentiment_scores if s < -0.05)
        neutral_count = len(sentiment_scores) - positive_count - negative_count
        
        # Overall analysis
        overall_analysis = self.analyze_text(text)
        
        return {
            "overall_sentiment": overall_analysis['sentiment'],
            "overall_emoji": overall_analysis['emoji'],
            "average_score": avg_sentiment,
            "compound_score": overall_analysis['compound_score'],
            "distribution": {
                "positive": positive_count,
                "neutral": neutral_count,
                "negative": negative_count
            },
            "percentages": {
                "positive": round((positive_count / len(sentiment_scores) * 100) if sentiment_scores else 0, 1),
                "neutral": round((neutral_count / len(sentiment_scores) * 100) if sentiment_scores else 0, 1),
                "negative": round((negative_count / len(sentiment_scores) * 100) if sentiment_scores else 0, 1)
            },
            "emotional_tone": self._get_emotional_tone(avg_sentiment)
        }
    
    def _get_emotional_tone(self, score: float) -> str:
        """Get descriptive emotional tone"""
        if score >= 0.5:
            return "Very Positive"
        elif score >= 0.05:
            return "Positive"
        elif score <= -0.5:
            return "Very Negative"
        elif score <= -0.05:
            return "Negative"
        else:
            return "Neutral"


# Singleton instance
_sentiment_service = None

def get_sentiment_service() -> SentimentService:
    """Get or create SentimentService instance"""
    global _sentiment_service
    if _sentiment_service is None:
        _sentiment_service = SentimentService()
    return _sentiment_service
