import csv
import os

DATA_PATH = os.path.join(
    os.path.dirname(__file__), "..", "data", "librarian.csv"
)

def librarian_login(librarian_id, password):
    with open(DATA_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["id"] == librarian_id and row["password"] == password:
                return {"success": True}

    return {"success": False, "message": "Invalid librarian credentials"}
