import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QTableWidgetItem
from ui_gui import Ui_MainWindow
from table import TableManager
# TODO: add to readme note to delete the code for starting on fedora
# ============================================= #
# Added only to start the code on my fedora
import os
os.environ["QT_QPA_PLATFORM"] = "wayland"
os.environ["QT_ENABLE_HIGHDPI_SCALING"] = "1"
# ============================================= #


class MainWindow(QMainWindow):
    """Initializing MainWindow to display it properly"""
    def __init__(self):
        super().__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.table_manager = TableManager(self.ui.tableWidget)

    def closeEvent(self, event):
        # ensure any recent changes are persisted before exit
        try:
            self.table_manager.save_table_state()
        except Exception:
            pass
        super().closeEvent(event)


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
