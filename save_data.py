import json
import os


class Data:
    def __init__(self, path='data_storage.json'):
        self.path = path
        self.ensure_file_exists()

    def ensure_file_exists(self):
        """If there is no file with self.path creates empty file"""
        if not os.path.exists(self.path):
            with open(self.path, 'w') as file:
                json.dump({}, file)

    def save_to_file(self, data):
        """Save data to file"""
        if data:
            with open(self.path, 'w') as file:
                print('The data was saved successfully')
                json.dump(data, file, indent=4)

    def load_file(self):
        try:
            with open(self.path, 'r') as file:
                return json.load(file)
        except json.decoder.JSONDecodeError as e:
            print(f'Wrong format in json file, which stores data. {e}')
            return {}


def save(data):
    save_data = Data()
    save_data.save_to_file(data)


def load():
    load_data = Data()
    return load_data.load_file()
