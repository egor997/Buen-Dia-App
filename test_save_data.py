from save_data import Data, save, load, clear

path = 'test_data_storage.json'


def test_clear_file_class_function():
    work_with_data = Data(path)
    work_with_data.clear_file()
    assert load(path) == {}


def test_clear_file():
    clear(path)
    assert load(path) == {}


def test_load_empty_data_class_function():
    work_with_data = Data(path)
    work_with_data.clear_file()
    assert work_with_data.load_file() == {}


def test_load_empty_data():
    clear(path)
    assert load(path) == {}


def test_write_and_load_some_data_class_function():
    work_with_data = Data(path)
    work_with_data.clear_file()
    fake_data = {"1": {"1": "cucumber"}, "2": "well done"}
    work_with_data.save_to_file(fake_data)
    assert load(path) == fake_data


def test_write_and_load_some_data():
    clear(path)
    fake_data = {"1": {"1": "cucumber"}, "2": "well done"}
    save(fake_data, path)
    assert load(path) == fake_data
