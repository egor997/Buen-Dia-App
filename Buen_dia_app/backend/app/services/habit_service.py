import json
import os
from typing import Dict, Any

def get_data_path() -> str:
    """Returns the absolute path to the data storage file."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    return os.path.join(base_dir, 'data', 'data_storage.json')

class HabitManager:
    """Handles JSON data storage for habits."""
    def __init__(self, path: str):
        self.path = path
        if not os.path.exists(self.path):
            self.ensure_file_exists()

    def ensure_file_exists(self):
        """Creates an empty JSON file and ensures directories exist."""
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, 'w') as file:
            json.dump({}, file)

    def save_to_file(self, data: Dict[str, Any]):
        """Saves data to JSON file."""
        if data is not None:
            with open(self.path, 'w') as file:
                json.dump(data, file, indent=4)

    def load_file(self) -> Dict[str, Any]:
        """Loads data from JSON file."""
        try:
            with open(self.path, 'r') as file:
                return json.load(file)
        except json.decoder.JSONDecodeError as e:
            print(f'Wrong format in json file, reverting to empty dict. {e}')
            return {}

def save_habits(data: Dict[str, Any]):
    """Wrapper function to save habits."""
    manager = HabitManager(get_data_path())
    manager.save_to_file(data)

def load_habits() -> Dict[str, Any]:
    """Wrapper function to load habits."""
    manager = HabitManager(get_data_path())
    return manager.load_file()
