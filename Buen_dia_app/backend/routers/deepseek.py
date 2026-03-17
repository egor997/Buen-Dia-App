import sys
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Ensure we can import from app_logic
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app_logic'))

router = APIRouter()

class DeepSeekRequest(BaseModel):
    model: str = "deepseek-chat"
    system_prompt: str = "You are a helpful coding assistant"
    user_prompt: str
    temperature: float = 1.0
    stream: bool = False

@router.post("/")
def query_deepseek(request: DeepSeekRequest):
    """
    Utilizes the logic from deepseek_api.py to fetch a response.
    """
    # Import inside the function to avoid breaking if the user hasn't set their key yet
    try:
        from openai import OpenAI
        from dotenv import load_dotenv
    except ImportError:
        raise HTTPException(status_code=500, detail="Missing OpenAI or python-dotenv libraries. Please install them.")
        
    env_path = os.path.join(os.path.dirname(__file__), '..', 'app_logic', '.env')
    load_dotenv(dotenv_path=env_path)

    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="DEEPSEEK_API_KEY not found in backend/app_logic/.env")

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": request.system_prompt},
                {"role": "user", "content": request.user_prompt},
            ],
            temperature=request.temperature,
            stream=request.stream
        )
        answer = response.choices[0].message.content
        return {"status": "success", "response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
