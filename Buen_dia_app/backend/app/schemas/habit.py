from pydantic import BaseModel
from typing import Dict, Any

class HabitData(BaseModel):
    data: Dict[str, Any]
