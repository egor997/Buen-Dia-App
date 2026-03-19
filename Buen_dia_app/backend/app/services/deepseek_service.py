import os
from fastapi import HTTPException
from app.schemas.deepseek import DeepSeekRequest

def query_deepseek_api(request: DeepSeekRequest) -> str:
    """
    Business logic to communicate with DeepSeek API.
    """
    try:
        from openai import OpenAI
        from dotenv import load_dotenv
    except ImportError:
        raise HTTPException(status_code=500, detail="Missing OpenAI or python-dotenv libraries. Please install them.")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    env_path = os.path.join(base_dir, 'data', '.env')
    
    load_dotenv(dotenv_path=env_path)

    api_key = os.environ.get('DEEPSEEK_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="DEEPSEEK_API_KEY not found in backend/data/.env")

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
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
