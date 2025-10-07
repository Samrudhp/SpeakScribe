#!/usr/bin/env python3
"""
Download required NLTK/TextBlob data packages
Run this once after pip install to set up all NLP dependencies
"""

import nltk
import sys

def download_nltk_data():
    """Download all required NLTK packages for TextBlob and sentiment analysis"""
    
    packages = [
        'punkt',  # Sentence tokenizer
        'averaged_perceptron_tagger',  # POS tagger
        'brown',  # Brown corpus
        'wordnet',  # WordNet lexical database
        'conll2000',  # Chunking corpus
        'movie_reviews'  # Sentiment corpus
    ]
    
    print("📦 Downloading NLTK data packages...")
    print("=" * 60)
    
    success_count = 0
    for package in packages:
        try:
            print(f"\n📥 Downloading {package}...")
            result = nltk.download(package, quiet=False)
            if result:
                print(f"✅ {package} downloaded successfully")
                success_count += 1
            else:
                print(f"⚠️  {package} already exists or failed")
        except Exception as e:
            print(f"❌ Error downloading {package}: {e}")
    
    print("\n" + "=" * 60)
    print(f"✅ Downloaded {success_count}/{len(packages)} packages")
    
    if success_count == len(packages):
        print("🎉 All NLTK data ready!")
        return True
    else:
        print("⚠️  Some packages failed. Sentiment analysis may not work properly.")
        return False

if __name__ == "__main__":
    success = download_nltk_data()
    sys.exit(0 if success else 1)
