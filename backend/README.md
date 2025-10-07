# SpeakScribe Backend

AI-powered meeting transcription and analysis backend using:
- **Whisper** (local transcription, CPU-optimized)
- **GPT4All** (local LLM for summarization)
- **Sentiment Analysis** (VADER + TextBlob)
- **Export** (PDF/DOCX generation)

**Configuration:** CPU-only for maximum stability on Apple Silicon M4

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
# or
uvicorn main:app --reload
```

## API Endpoints

- `POST /transcribe` - Transcribe audio file
- `POST /sentiment` - Analyze sentiment
- `POST /actions` - Extract action items
- `POST /topics` - Extract topics
- `POST /summarize` - Generate summary
- `POST /process` - Full pipeline (all features)
- `POST /export/pdf` - Export to PDF
- `POST /export/docx` - Export to DOCX

## Directory Structure

```
backend/
├── main.py                 # FastAPI application
├── config.py              # Configuration
├── requirements.txt       # Dependencies
├── services/              # AI services
│   ├── whisper_service.py
│   ├── llm_service.py
│   ├── sentiment_service.py
│   └── export_service.py
├── uploads/               # Uploaded audio files
└── exports/               # Generated reports
```
