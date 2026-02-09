from unittest.mock import Mock
from gui import MainWindow
from PyQt5 import QtCore
import pytest
# TODO: fix this tests, gui doesn't start

class Item:
    def __init__(self, row=1, column=4, checked=False):
        self._row = row
        self._column = column
        self._checked = checked

    def column(self):
        return self._column

    def row(self):
        return self._row

    def checkState(self):
        return QtCore.Qt.Checked if self._checked else QtCore.Qt.Unchecked


class Table:
    def __init__(self):
        self.table = {
            1: {1: 'False', 2: 'False', 3: 'False', 4: 'False', 5: 'False', 'streak': 1},  # Only False
            2: {1: 'True', 2: 'True', 3: 'True', 4: 'True', 5: 'True', 'streak': 1},  # Only True
            3: {1: 'True', 2: 'True', 3: 'True', 4: 'False', 5: 'False', 'streak': 1},  # True at the beginning
            4: {1: 'True', 2: 'True', 3: 'True', 4: 'False', 5: 'True', 'streak': 1},  # Streak broken
            5: {1: 'False', 2: 'True', 3: 'True', 4: 'True', 5: 'True', 'streak': 'True'}  # Streak 4 True and the streak column is True
        }

    def columnCount():
        return 5

    def item(self, row, col):
        # Return mock item if exists in data
        if row in self.data and col in self.data[row]:
            is_checked = self.table[row][col]
            return Item(row, col, is_checked)
        return None


def test_count_streak_only_True(monkeypatch):
    window = MainWindow()
    mock_datetime = Mock()
    mock_datetime.today.return_value.day = 5
    monkeypatch.setattr('gui.datetime', mock_datetime)
    fake_table = Table()
    fake_item = Item(row=2, column=4)
    monkeypatch.setattr(window.ui, 'tableWidget', fake_table)
    streak = window.count_streak(fake_item)
    assert streak == 5
