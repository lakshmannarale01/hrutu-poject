import csv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "../data/books.csv")


def view_all_books():
    books = []

    with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for idx, row in enumerate(reader, start=1):
            books.append({
                "id": idx,
                "title": row.get("title") or row.get("Harry Potter and the Half-Blood Prince (Harry Potter #6)", ""),
                "author": row.get("author") or row.get("J.K. Rowling/Mary GrandPré", ""),
                "publisher": row.get("publisher") or row.get("Scholastic Inc.", ""),
                "available": row.get("True", "False") == "True"
            })

    return books
