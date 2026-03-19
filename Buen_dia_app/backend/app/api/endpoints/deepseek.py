from fastapi import APIRouter
from app.schemas.deepseek import DeepSeekRequest
from app.services.deepseek_service import query_deepseek_api

router = APIRouter()

@router.post("")
def query_deepseek(request: DeepSeekRequest):
    """
    Utilizes deepseek API to fetch a response.
    """
    answer = query_deepseek_api(request)
    return {"status": "success", "response": answer}
