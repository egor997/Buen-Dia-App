import json
import os


class Data:
    """Class for easy work with json files"""
    def __init__(self, path='data_storage.json'):
        self.path = path
        if not os.path.exists(self.path):
            self.ensure_file_exists()

    def ensure_file_exists(self):
        """If there is no file with self.path creates empty file"""
        with open(self.path, 'w') as file:
            json.dump({}, file)

    def save_to_file(self, data):
        """Save data to file"""
        if data:
            with open(self.path, 'w') as file:
                print('The data was saved successfully')
                json.dump(data, file, indent=4)

    def load_file(self):
        """Load data from json file"""
        try:
            with open(self.path, 'r') as file:
                return json.load(file)
        except json.decoder.JSONDecodeError as e:
            print(f'Wrong format in json file, which stores data. {e}')
            return {}

    def clear_file(self):
        self.ensure_file_exists()
        print('The saved data was cleared')


def save(data, path='data_storage.json'):
    save_data = Data(path)
    save_data.save_to_file(data)


def load(path='data_storage.json'):
    load_data = Data(path)
    return load_data.load_file()


def clear(path='data_storage.json'):
    data = Data(path)
    data.clear_file()
