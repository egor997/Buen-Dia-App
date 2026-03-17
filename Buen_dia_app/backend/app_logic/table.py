# TODO: add the function which defines the month and changes the amount of days to display ### datetime lib
# TODO: change the adjusting of columns when the window is full screen
from PyQt5 import QtCore
from PyQt5.QtWidgets import QTableWidgetItem
from save_data import save, load
from datetime import datetime


class TableManager:
	def __init__(self, tableWidget):
		self.tableWidget = tableWidget
		self.set_up_table_items()

	def set_up_table_items(self):
		columns = self.tableWidget.columnCount()
		for row in range(self.tableWidget.rowCount()):
			for column in range(columns-1):
				item = QTableWidgetItem()
				item.setFlags(QtCore.Qt.ItemIsUserCheckable | QtCore.Qt.ItemIsEnabled | QtCore.Qt.ItemIsSelectable)
				item.setCheckState(QtCore.Qt.Unchecked)
				item.setText("")
				item.setTextAlignment(QtCore.Qt.AlignCenter)
				self.tableWidget.setColumnWidth(column, 28)
				self.tableWidget.setItem(row, column, item)
			streak_item = QTableWidgetItem()
			streak_item.setText("")
			streak_item.setTextAlignment(QtCore.Qt.AlignCenter)
			streak_item.setFlags(QtCore.Qt.ItemIsEnabled)
			self.tableWidget.setItem(row, columns-1, streak_item)
		self.tableWidget.itemChanged.connect(self.on_item_changed)
		self.load_table_state()

	def on_item_changed(self, item):
		if item.column() == self.tableWidget.columnCount() - 1:
			return
		self.count_streak(item)
		self.save_table_state()

	def get_table_state(self):
		to_save = {}
		rows = self.tableWidget.rowCount()
		columns = self.tableWidget.columnCount()
		for row in range(rows):
			row_data = {}
			for col in range(columns-1):
				item = self.tableWidget.item(row, col)
				checked = False
				if item and item.checkState() == QtCore.Qt.Checked:
					checked = True
				row_data[str(col)] = checked
			to_save[str(row)] = row_data
		return to_save

	def save_table_state(self):
		data = self.get_table_state()
		save(data)

	def load_table_state(self):
		data = load()
		if not data:
			return
		self.tableWidget.blockSignals(True)
		rows = self.tableWidget.rowCount()
		cols = self.tableWidget.columnCount()
		for row in range(rows):
			row_key = str(row)
			if row_key not in data:
				continue
			row_state = data[row_key]
			for col in range(cols-1):
				col_key = str(col)
				item = self.tableWidget.item(row, col)
				if item is None:
					continue
				if col_key in row_state and row_state[col_key]:
					item.setCheckState(QtCore.Qt.Checked)
				else:
					item.setCheckState(QtCore.Qt.Unchecked)
		self.update_all_streaks()
		self.tableWidget.blockSignals(False)

	def update_all_streaks(self):
		rows = self.tableWidget.rowCount()
		for r in range(rows):
			it = self.tableWidget.item(r, 0)
			if it:
				self.count_streak(it)

	def count_streak(self, item):
		streak_column = self.tableWidget.columnCount()-1
		if item.column() == streak_column:
			return 0
		today_day = datetime.today().day
		streak = 0
		for column in range(today_day):
			table_item = self.tableWidget.item(item.row(), column)
			if table_item and table_item.checkState() == QtCore.Qt.Checked:
				streak += 1
			else:
				streak = 0
		streak_item = self.tableWidget.item(item.row(), streak_column)
		streak_item.setText(str(streak))
		return streak
