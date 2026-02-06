import csv
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "books.csv"))

def view_all_books():
    books = []

    with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            books.append(row)

    return books

