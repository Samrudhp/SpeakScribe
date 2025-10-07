#!/usr/bin/env python3
"""
Check for AI models in cache directories
"""
import os
from pathlib import Path

def check_models():
    """Check if AI models are present in cache directories"""
    
    home = Path.home()
    whisper_cache = home / ".cache" / "whisper"
    gpt4all_cache = home / ".cache" / "gpt4all"
    
    print("🔍 Checking for AI models in cache...\n")
    
    # Check Whisper models
    print("📁 Whisper Cache Directory:", whisper_cache)
    if whisper_cache.exists():
        whisper_models = list(whisper_cache.glob("*.pt"))
        if whisper_models:
            print(f"✅ Found {len(whisper_models)} Whisper model(s):")
            for model in whisper_models:
                size_mb = model.stat().st_size / (1024 * 1024)
                print(f"   - {model.name} ({size_mb:.1f} MB)")
        else:
            print("⚠️  No Whisper models found")
    else:
        print("❌ Whisper cache directory doesn't exist")
    
    print()
    
    # Check GPT4All models
    print("📁 GPT4All Cache Directory:", gpt4all_cache)
    if gpt4all_cache.exists():
        gpt4all_models = list(gpt4all_cache.glob("*.gguf")) + list(gpt4all_cache.glob("*.bin"))
        if gpt4all_models:
            print(f"✅ Found {len(gpt4all_models)} GPT4All model(s):")
            for model in gpt4all_models:
                size_mb = model.stat().st_size / (1024 * 1024)
                print(f"   - {model.name} ({size_mb:.1f} MB)")
        else:
            print("⚠️  No GPT4All models found")
    else:
        print("❌ GPT4All cache directory doesn't exist")
    
    print("\n" + "="*60)
    print("Note: Models will be downloaded automatically on first use")
    print("="*60)

if __name__ == "__main__":
    check_models()
