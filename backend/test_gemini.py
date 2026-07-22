import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

print("KEY:", os.getenv("GEMINI_API_KEY")[:15])

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents="Say Hello"
)
print(response.text)