import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIBRARIAN_CSV = os.path.join(BASE_DIR, "data", "librarian.csv")
STUDENT_CSV = os.path.join(BASE_DIR, "data", "students.csv")


def _load_users(path, role):
    users = []
    if not os.path.exists(path):
        return users
    with open(path, newline="", encoding="utf-8") as file:
        reader = csv.reader(file)
        for row in reader:
            if not row:
                continue
            if role == "librarian":
                # id, name, password
                if len(row) < 3:
                    continue
                users.append(
                    {
                        "id": row[0].strip(),
                        "name": row[1].strip(),
                        "password": row[2].strip(),
                        "role": "librarian",
                    }
                )
            else:
                # id, name, password, department
                if len(row) < 4:
                    continue
                users.append(
                    {
                        "id": row[0].strip(),
                        "name": row[1].strip(),
                        "password": row[2].strip(),
                        "department": row[3].strip(),
                        "role": "student",
                    }
                )
    return users


def authenticate_user(role, username, password):
    role = (role or "librarian").lower()
    users = _load_users(LIBRARIAN_CSV, "librarian") if role == "librarian" else _load_users(STUDENT_CSV, "student")
    username = (username or "").strip().lower()
    password = (password or "").strip()
    for user in users:
        if user["password"] != password:
            continue
        if user["id"].lower() == username or user["name"].lower() == username:
            safe_user = {k: v for k, v in user.items() if k != "password"}
            return True, safe_user
    return False, None


def register_student(student_id, name, password, department):
    if not student_id or not name or not password or not department:
        return False, "Missing required fields."
    users = _load_users(STUDENT_CSV, "student")
    for user in users:
        if user["id"].lower() == student_id.lower():
            return False, "Student ID already exists."
    with open(STUDENT_CSV, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([student_id, name, password, department])
    return True, None
