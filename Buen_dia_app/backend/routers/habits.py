import sys
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

# Ensure we can import from app_logic
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app_logic'))
from save_data import load, save

router = APIRouter()

# Define the expected data model for saving habits
class HabitData(BaseModel):
    data: Dict[str, Any]

@router.get("/")
def get_habits():
    """
    Retrieves the current habit tracker state from data_storage.json
    using the original save_data.py logic.
    """
    file_path = os.path.join(os.path.dirname(__file__), '..', 'app_logic', 'data_storage.json')
    data = load(file_path)
    return {"status": "success", "data": data}

@router.post("/")
def save_habits(payload: HabitData):
    """
    Saves the new habit tracker state using the original save_data.py logic.
    """
    file_path = os.path.join(os.path.dirname(__file__), '..', 'app_logic', 'data_storage.json')
    save(payload.data, file_path)
    return {"status": "success", "message": "Habit data saved successfully"}
