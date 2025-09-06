import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model (choose the one you want)
model = genai.GenerativeModel('gemini-1.5-flash')


async def generate_answer_gemini(question: str, docs: list[str]) -> str:
    context = " ".join(docs)
    prompt = f"Context: {context}\nQuestion: {question}\nAnswer:"

    # Generate content with Gemini
    response = model.generate_content(prompt)

    return response.text.strip()
