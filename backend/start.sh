#!/bin/bash

# SpeakScribe Backend Startup Script

echo "🚀 Starting SpeakScribe Backend..."
echo ""

#!/bin/bash

# SpeakScribe Backend Startup Script
# CPU-only configuration for maximum stability

echo "🚀 Starting SpeakScribe Backend (CPU-only mode)"
echo "================================================"
echo ""

# Check if virtual environment is activated
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "⚠️  Virtual environment not activated!"
    echo "Run: source venv/bin/activate"
    exit 1
fi

# Check models
echo "📦 Checking cached models..."
python check_models.py
echo ""

# Start server
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "💻 Running on CPU for maximum stability"
echo "Press CTRL+C to stop"
echo ""

python main.py

# Check Python version
PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
echo "✅ Python version: $PYTHON_VERSION"

# Check if models exist
echo ""
echo "📦 Checking for cached models..."
python check_models.py
echo ""

# Start info
echo "🎯 Starting FastAPI server..."
echo "Server will be available at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Run the server
python main.py
