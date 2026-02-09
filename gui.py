import sys
from PyQt5 import QtCore
from PyQt5.QtWidgets import QApplication, QMainWindow, QTableWidgetItem
from ui_gui import Ui_MainWindow
from datetime import datetime
# TODO: add the function which defines the month and changes the amount of days to display ### datetime lib
# TODO: add to readme note to delete the code for starting on fedora
# ============================================= #
# Added only to start the code on my fedora
import os
os.environ["QT_QPA_PLATFORM"] = "wayland"
os.environ["QT_ENABLE_HIGHDPI_SCALING"] = "1"
# ============================================= #


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.set_up_table_items()

    def set_up_table_items(self):
            rows = self.ui.tableWidget.rowCount()
            columns = self.ui.tableWidget.columnCount()
            for row in range(rows):
                for column in range(columns-1):
                    item = QTableWidgetItem()
                    item.setFlags(QtCore.Qt.ItemIsUserCheckable |
                                QtCore.Qt.ItemIsEnabled |
                                QtCore.Qt.ItemIsSelectable)
                    item.setCheckState(QtCore.Qt.Unchecked)
                    item.setTextAlignment(QtCore.Qt.AlignCenter)

                    self.ui.tableWidget.setItem(row, column, item)
                streak_item = QTableWidgetItem()
                streak_item.setTextAlignment(QtCore.Qt.AlignCenter)
                self.ui.tableWidget.setItem(row, columns-1, streak_item)

            self.ui.tableWidget.itemChanged.connect(self.count_streak)

    # set up streak column
    def count_streak(self, item):
        streak_column = self.ui.tableWidget.columnCount()-1
        # check if it's not the streak column
        if item.column() == streak_column:
            return 0

        today_day = datetime.today().day
        streak = 0
        for column in range(today_day):
            table_item = self.ui.tableWidget.item(item.row(), column)
            if table_item and table_item.checkState() == QtCore.Qt.Checked:
                streak += 1
            else:
                streak = 0
        streak_item = self.ui.tableWidget.item(item.row(), streak_column)
        streak_item.setText(str(streak))
        return streak


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
