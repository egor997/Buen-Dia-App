from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
import os

from app.services.cards_from_quizzlet import export_quizlet_words

router = APIRouter()

class QuizletScrapeRequest(BaseModel):
    url: str

@router.post("/scrape")
def scrape_quizlet(payload: QuizletScrapeRequest):
    output_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'my_words.json')
    # Try to make sure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    try:
        words = export_quizlet_words(payload.url, output_path)
        return {"status": "success", "data": words}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape Quizlet: {str(e)}")

@router.get("/saved")
def get_saved_cards():
    output_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'my_words.json')
    if not os.path.exists(output_path):
        return {"status": "success", "data": []}
    
    import json
    with open(output_path, 'r', encoding='utf-8') as f:
        try:
            return {"status": "success", "data": json.load(f)}
        except json.JSONDecodeError:
            return {"status": "success", "data": []}
