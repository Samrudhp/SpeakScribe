from transformers import TFAutoModelForSeq2SeqLM, AutoTokenizer
import tensorflow as tf

# Load TensorFlow model and tokenizer
model_name = "t5-small"  # or "facebook/bart-large-cnn" (TF version)
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = TFAutoModelForSeq2SeqLM.from_pretrained(model_name)

def summarize_text(text):
    input_ids = tokenizer("summarize: " + text, return_tensors="tf", max_length=512, truncation=True).input_ids
    summary_ids = model.generate(input_ids, max_length=150, min_length=40, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary
