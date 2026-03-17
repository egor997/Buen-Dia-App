from unittest.mock import Mock
from PyQt5 import QtCore
from table import TableManager


# Mock QTableWidgetItem
class MockItem:
    def __init__(self, row, col, checked=False):
        self._row = row
        self._col = col
        self._checked = checked
        self._text = ''

    def row(self):
        return self._row

    def column(self):
        return self._col

    def checkState(self):
        return QtCore.Qt.Checked if self._checked else QtCore.Qt.Unchecked

    def setCheckState(self, state):
        self._checked = (state == QtCore.Qt.Checked)

    def setText(self, text):
        self._text = text

    def text(self):
        return self._text


# Mock signal for PyQt
class MockSignal:
    def connect(self, func):
        self._connected = func


# Mock QTableWidget
class MockTableWidget:
    def __init__(self, rows, cols, data_matrix):
        self._rows = rows
        self._cols = cols
        self._items = {}
        for row in range(rows):
            for col in range(cols):
                checked = data_matrix[str(row)][str(col)] if col < len(data_matrix[str(row)]) else False
                self._items[(row, col)] = MockItem(row, col, checked)
        self.itemChanged = MockSignal()

    def rowCount(self):
        return self._rows

    def columnCount(self):
        return self._cols

    def item(self, row, col):
        return self._items.get((row, col), None)

    def setItem(self, row, col, item):
        self._items[(row, col)] = item

    def blockSignals(self, val):
        pass

    def setColumnWidth(self, col, width):
        pass


data_matrix = {
    "0": {
        "0": True,
        "1": True,
        "2": True,
        "3": True,
        "4": True,
        "5": True,
    },
    "1": {
        "0": False,
        "1": False,
        "2": False,
        "3": False,
        "4": False,
        "5": False,
    }
}


def test_count_streak_only_True(monkeypatch):
    # Simulate today is day 6 (so all columns 0-5 are checked)
    mock_datetime = Mock()
    mock_datetime.today.return_value.day = 6
    monkeypatch.setattr('table.datetime', mock_datetime)

    tableWidget = MockTableWidget(rows=2, cols=7, data_matrix=data_matrix)
    manager = TableManager(tableWidget)
    item = tableWidget.item(0, 0)
    streak = manager.count_streak(item)
    assert streak == 6


def test_count_streak_only_False(monkeypatch):
    # Simulate today is day 6 (all unchecked)
    mock_datetime = Mock()
    mock_datetime.today.return_value.day = 6
    monkeypatch.setattr('table.datetime', mock_datetime)

    tableWidget = MockTableWidget(rows=2, cols=7, data_matrix=data_matrix)
    manager = TableManager(tableWidget)
    item = tableWidget.item(1, 0)
    streak = manager.count_streak(item)
    assert streak == 0


def test_count_streak_partial(monkeypatch):
    # Simulate today is day 6, row with mixed True/False
    mock_datetime = Mock()
    mock_datetime.today.return_value.day = 6
    monkeypatch.setattr('table.datetime', mock_datetime)

    # row 2: [True, True, False, True, True, True] (should streak 3 at the end)
    partial_matrix = {
        "0": {"0": True, "1": True, "2": True, "3": True, "4": True, "5": True},
        "1": {"0": False, "1": False, "2": False, "3": False, "4": False, "5": False},
        "2": {"0": True, "1": True, "2": False, "3": True, "4": True, "5": True},
    }
    tableWidget = MockTableWidget(rows=3, cols=7, data_matrix=partial_matrix)
    manager = TableManager(tableWidget)
    item = tableWidget.item(2, 0)
    streak = manager.count_streak(item)
    assert streak == 3


def test_count_streak_broken_streak(monkeypatch):
    # Simulate today is day 6, row with streak broken in the middle
    mock_datetime = Mock()
    mock_datetime.today.return_value.day = 6
    monkeypatch.setattr('table.datetime', mock_datetime)

    # row 3: [True, True, False, True, False, True] (should streak 1 at the end)
    broken_matrix = {
        "0": {"0": True, "1": True, "2": True, "3": True, "4": True, "5": True},
        "1": {"0": False, "1": False, "2": False, "3": False, "4": False, "5": False},
        "2": {"0": True, "1": True, "2": False, "3": True, "4": True, "5": True},
        "3": {"0": True, "1": True, "2": False, "3": True, "4": False, "5": True},
    }
    tableWidget = MockTableWidget(rows=4, cols=7, data_matrix=broken_matrix)
    manager = TableManager(tableWidget)
    item = tableWidget.item(3, 0)
    streak = manager.count_streak(item)
    assert streak == 1
