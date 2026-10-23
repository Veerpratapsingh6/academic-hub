
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from .env")

client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(timeout=30000)
)
  

def ask_gemini(question: str) -> str:
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=question
    )

    return response.text or "No response generated."
