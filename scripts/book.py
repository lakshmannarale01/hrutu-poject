import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "data", "books.csv")


def _parse_bool(value):
    return str(value).strip().lower() in {"true", "1", "yes", "y"}


def view_all_books():
    books = []

    with open(CSV_PATH, newline="", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) < 7:
                continue
            books.append(
                {
                    "id": row[0].strip(),
                    "title": row[1].strip(),
                    "author": row[2].strip(),
                    "publisher": row[3].strip(),
                    "publish_date": row[4].strip(),
                    "available": _parse_bool(row[5]),
                    "quantity": int(row[6]) if row[6].strip().isdigit() else 0,
                }
            )

    return books


def add_book(book):
    books = view_all_books()
    next_id = 1
    if books:
        try:
            next_id = max(int(b["id"]) for b in books) + 1
        except ValueError:
            next_id = len(books) + 1
    with open(CSV_PATH, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(
            [
                str(next_id),
                book.get("title", ""),
                book.get("author", ""),
                book.get("publisher", ""),
                book.get("publish_date", ""),
                "True",
                str(book.get("quantity", 1)),
            ]
        )
    return next_id
