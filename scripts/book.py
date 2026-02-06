import csv
import os
from datetime import datetime
from shutil import copyfile

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "books.csv")
BKP_DIR = os.path.join(BASE_DIR, "..", "data_bkp")


def _backup():
    os.makedirs(BKP_DIR, exist_ok=True)
    backup_file = os.path.join(
        BKP_DIR, f"books_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    )
    copyfile(DATA_PATH, backup_file)


def view_all_books():
    with open(DATA_PATH, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def borrow_book(book_id, student_id):
    books = view_all_books()
    updated = False

    for book in books:
        if book["id"] == book_id and book["available"] == "True":
            book["available"] = "False"
            book["borrowed_by"] = student_id
            updated = True
            break

    if not updated:
        return {"success": False, "message": "Book not available"}

    _backup()
    _write_books(books)
    return {"success": True, "message": "Book borrowed successfully"}


def return_book(book_id, student_id):
    books = view_all_books()

    for book in books:
        if book["id"] == book_id and book["borrowed_by"] == student_id:
            book["available"] = "True"
            book["borrowed_by"] = ""
            _backup()
            _write_books(books)
            return {"success": True, "message": "Book returned successfully"}

    return {"success": False, "message": "Invalid return request"}


def _write_books(books):
    with open(DATA_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=books[0].keys())
        writer.writeheader()
        writer.writerows(books)
