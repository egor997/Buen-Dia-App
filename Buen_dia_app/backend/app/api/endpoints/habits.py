from fastapi import APIRouter
from app.schemas.habit import HabitData
from app.services.habit_service import load_habits, save_habits

router = APIRouter()

@router.get("")
def get_habits():
    """
    Retrieves the current habit tracker state from data_storage.json.
    """
    data = load_habits()
    return {"status": "success", "data": data}

@router.post("")
def update_habits(payload: HabitData):
    """
    Saves the new habit tracker state to JSON.
    """
    save_habits(payload.data)
    return {"status": "success", "message": "Habit data saved successfully"}
