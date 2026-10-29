
import os
import time
import random
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
    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=question
            )

            return response.text or "No response generated."

        except Exception as error:
            error_message = str(error).lower()

            is_temporary_error = (
                "503" in error_message
                or "429" in error_message
                or "unavailable" in error_message
                or "resource_exhausted" in error_message
                or "too many requests" in error_message
            )

            if not is_temporary_error or attempt == max_attempts - 1:
                raise

            wait_time = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait_time)

    return "No response generated."

