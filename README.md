# 🎙️ SpeakScribe – AI-Powered Meeting Analysis & Transcription

A cutting-edge web application that **transcribes**, **analyzes**, and **summarizes** meeting audio using **local AI models**. Upload your meeting recording and get instant AI-powered insights with beautiful glassmorphism UI!

---

![App Screenshot](./frontend/public/p1.png)
![App Screenshot](./frontend/public/p2.png)
![App Screenshot](./frontend/public/p3.png)

## ✨ Features

### 🤖 **AI-Powered Analysis (100% Local)**
- 🎤 **Whisper Small** - Fast, accurate speech-to-text (optimized for Apple Silicon M4)
- 🧠 **GPT4All** - Local LLM for summarization (no API costs!)
- 😊 **Sentiment Analysis** - Detect emotional tone (positive/negative/neutral)
- 👥 **Speaker Diarization** - Identify who said what with timestamps
- 📋 **Action Items** - Automatically extract tasks, decisions, and deadlines
- 🏷️ **Topic Extraction** - Identify key discussion themes
- 📄 **Smart Summarization** - Generate concise or detailed summaries
- 📥 **Export** - Save reports as PDF, DOCX, or JSON

### 🎨 **Modern Glassmorphism UI**
- 💎 Beautiful frosted glass effects with backdrop blur
- ✨ Smooth animations and transitions with Framer Motion
- 🌈 Gradient backgrounds and accent colors
- 📱 Fully responsive design
- 🎯 Intuitive drag-and-drop interface
- 🔮 Real-time progress indicators

---

## 🚀 Tech Stack

| Layer      | Technology            |
|------------|------------------------|
| **Frontend**   | React, TailwindCSS, Framer Motion, WaveSurfer.js |
| **Backend**    | FastAPI, Python 3.10+ |
| **AI Models**  | Whisper (Small), GPT4All (Mistral 7B) |
| **NLP**        | VADER Sentiment, TextBlob, SpaCy |
| **Export**     | FPDF, python-docx, ReportLab |

---

## 📦 Installation & Setup

### ✅ Prerequisites
- **Node.js** v18+
- **Python** 3.10+
- **macOS** with Apple Silicon (M1/M2/M3/M4) recommended for best performance

### 🔧 Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Note:** First run will download AI models (~2GB total):
- Whisper Small (~500MB)
- GPT4All Mistral 7B (~4GB)

### 🌐 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🎯 API Endpoints

| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| GET    | `/`              | Health check                         |
| POST   | `/transcribe`    | Transcribe audio file                |
| POST   | `/sentiment`     | Analyze sentiment of text            |
| POST   | `/actions`       | Extract action items & decisions     |
| POST   | `/topics`        | Extract key topics                   |
| POST   | `/summarize`     | Generate summary (concise/detailed/executive) |
| POST   | `/process`       | **Full pipeline** - All features at once |
| POST   | `/export/pdf`    | Export results as PDF                |
| POST   | `/export/docx`   | Export results as DOCX               |

---

## 🏗️ Project Structure

```
SpeakScribe/
├── backend/
│   ├── main.py                    # FastAPI app
│   ├── config.py                  # Configuration
│   ├── requirements.txt           # Python dependencies
│   ├── services/
│   │   ├── whisper_service.py     # Transcription service
│   │   ├── llm_service.py         # GPT4All summarization
│   │   ├── sentiment_service.py   # Sentiment analysis
│   │   └── export_service.py      # PDF/DOCX export
│   ├── uploads/                   # Uploaded audio files
│   └── exports/                   # Generated reports
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── ProgressStepper.jsx
│   │   │   ├── SentimentMeter.jsx
│   │   │   ├── ActionItems.jsx
│   │   │   ├── TopicTags.jsx
│   │   │   ├── SpeakerTimeline.jsx
│   │   │   └── ExportButtons.jsx
│   │   ├── index.css              # Glassmorphism styles
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js         # Tailwind configuration
│
└── README.md
```

---

## 🎨 UI Features

### Glassmorphism Design
- Frosted glass cards with backdrop blur
- Gradient overlays and animations
- Smooth hover effects and transitions
- Beautiful color palette (indigo, purple, pink)

### Components
1. **Upload Zone** - Drag & drop with visual feedback
2. **Audio Player** - Waveform visualization with play controls
3. **Progress Stepper** - Real-time processing status
4. **Sentiment Meter** - Visual sentiment distribution
5. **Action Items** - Interactive checklist for tasks
6. **Topic Tags** - Colorful topic badges
7. **Speaker Timeline** - Conversation flow with speakers
8. **Export Buttons** - One-click export to PDF/DOCX

---

## 🔥 Performance Optimizations

### Apple Silicon M4 Optimized
- ✅ **MPS Backend** for Whisper (Metal Performance Shaders)
- ✅ **Quantized Models** (Q4_0) for GPT4All
- ✅ **Efficient Processing** - Chunking for large files
- ✅ **Model Caching** - Load once, reuse multiple times

---

## 🚧 Roadmap

- [x] Local Whisper transcription
- [x] GPT4All summarization
- [x] Sentiment analysis
- [x] Speaker diarization
- [x] Action item extraction
- [x] Topic modeling
- [x] PDF/DOCX export
- [x] Glassmorphism UI
- [ ] Real-time transcription (WebSocket streaming)
- [ ] Multi-language support UI
- [ ] Meeting history & search (RAG with vector DB)
- [ ] Custom AI model fine-tuning

---

## 📝 License

MIT License - feel free to use this project for your own purposes!

---

## 🙏 Credits

- **Whisper** by OpenAI
- **GPT4All** by Nomic AI
- **React** by Meta
- **FastAPI** by Sebastián Ramírez
- **TailwindCSS** & **Framer Motion** for UI

---

## 🐛 Troubleshooting

**Models not downloading?**
- Check internet connection
- Models auto-download on first run
- Whisper: `~/.cache/whisper/`
- GPT4All: `~/.cache/gpt4all/`

**Backend not starting?**
- Ensure Python 3.10+
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is available

**Frontend errors?**
- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

---

**Built with ❤️ for the AI community**
