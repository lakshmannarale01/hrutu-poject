import csv
import datetime
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
BOOKS_CSV = os.path.join(DATA_DIR, "books.csv")
BORROWS_CSV = os.path.join(DATA_DIR, "all_borrows.csv")
TRANSACTIONS_CSV = os.path.join(DATA_DIR, "all_transactions.csv")
STUDENTS_CSV = os.path.join(DATA_DIR, "students.csv")
LIBRARIAN_CSV = os.path.join(DATA_DIR, "librarian.csv")


def _parse_bool(value):
    return str(value).strip().lower() in {"true", "1", "yes", "y"}


def _format_bool(value):
    return "True" if value else "False"


def _today():
    return datetime.datetime.now().strftime("%d-%m-%Y")


def _read_rows(path):
    if not os.path.exists(path):
        return []
    with open(path, newline="", encoding="utf-8") as file:
        return [row for row in csv.reader(file) if row]


def _write_rows(path, rows):
    with open(path, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerows(rows)


def _next_id(prefix, rows):
    if not rows:
        return f"{prefix}0001"
    last = rows[-1][0]
    try:
        new_id = int(last[2:]) + 1
    except ValueError:
        new_id = len(rows) + 1
    return f"{prefix}{new_id:04d}"


def list_books():
    rows = _read_rows(BOOKS_CSV)
    books = []
    for row in rows:
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


def add_book(payload):
    rows = _read_rows(BOOKS_CSV)
    next_id = 1
    numeric_ids = []
    for row in rows:
        try:
            numeric_ids.append(int(row[0]))
        except (ValueError, IndexError):
            continue
    if numeric_ids:
        next_id = max(numeric_ids) + 1
    title = payload.get("title", "").strip()
    author = payload.get("author", "").strip()
    publisher = payload.get("publisher", "").strip()
    publish_date = payload.get("publish_date", "").strip()
    quantity = payload.get("quantity", 1)
    try:
        quantity = int(quantity)
    except ValueError:
        quantity = 1
    available = quantity > 0
    rows.append(
        [
            str(next_id),
            title,
            author,
            publisher,
            publish_date,
            _format_bool(available),
            str(quantity),
        ]
    )
    _write_rows(BOOKS_CSV, rows)
    return next_id


def update_book(book_id, payload):
    rows = _read_rows(BOOKS_CSV)
    updated = None
    for row in rows:
        if row[0] == book_id:
            if len(row) < 7:
                row.extend([""] * (7 - len(row)))
            row[1] = payload.get("title", row[1]).strip()
            row[2] = payload.get("author", row[2]).strip()
            row[3] = payload.get("publisher", row[3]).strip()
            row[4] = payload.get("publish_date", row[4]).strip()
            if "quantity" in payload:
                try:
                    row[6] = str(int(payload.get("quantity", row[6])))
                except ValueError:
                    pass
            available = int(row[6]) > 0 if str(row[6]).isdigit() else True
            row[5] = _format_bool(available)
            updated = row
            break
    _write_rows(BOOKS_CSV, rows)
    return updated


def remove_book(book_id):
    rows = _read_rows(BOOKS_CSV)
    kept = []
    removed = None
    for row in rows:
        if row[0] == book_id and removed is None:
            removed = row
            continue
        kept.append(row)
    _write_rows(BOOKS_CSV, kept)
    return removed


def register_librarian(name, password):
    rows = _read_rows(LIBRARIAN_CSV)
    librarian_id = _next_id("lb", rows)
    rows.append([librarian_id, name.strip(), password.strip()])
    _write_rows(LIBRARIAN_CSV, rows)
    return librarian_id


def borrow_book(student_id, book_id):
    books = _read_rows(BOOKS_CSV)
    borrowed_book = None
    for row in books:
        if row[0] == book_id:
            if len(row) < 7:
                row.extend([""] * (7 - len(row)))
            qty = int(row[6]) if row[6].isdigit() else 0
            if qty <= 0:
                return None
            qty -= 1
            row[6] = str(qty)
            row[5] = _format_bool(qty > 0)
            borrowed_book = row
            break
    _write_rows(BOOKS_CSV, books)
    if not borrowed_book:
        return None
    trans_id = _next_id("tr", _read_rows(TRANSACTIONS_CSV))
    today = _today()
    transactions = _read_rows(TRANSACTIONS_CSV)
    transactions.append([trans_id, student_id, book_id, today, "b"])
    _write_rows(TRANSACTIONS_CSV, transactions)
    borrows = _read_rows(BORROWS_CSV)
    borrows.append([trans_id, student_id, book_id, today])
    _write_rows(BORROWS_CSV, borrows)
    return {"transaction_id": trans_id, "date": today, "book_id": book_id}


def return_book(student_id, book_id):
    books = _read_rows(BOOKS_CSV)
    returned_book = None
    for row in books:
        if row[0] == book_id:
            if len(row) < 7:
                row.extend([""] * (7 - len(row)))
            qty = int(row[6]) if row[6].isdigit() else 0
            qty += 1
            row[6] = str(qty)
            row[5] = _format_bool(True)
            returned_book = row
            break
    _write_rows(BOOKS_CSV, books)
    if not returned_book:
        return None
    trans_id = _next_id("tr", _read_rows(TRANSACTIONS_CSV))
    today = _today()
    transactions = _read_rows(TRANSACTIONS_CSV)
    transactions.append([trans_id, student_id, book_id, today, "r"])
    _write_rows(TRANSACTIONS_CSV, transactions)
    borrows = _read_rows(BORROWS_CSV)
    borrows = [
        row
        for row in borrows
        if not (row[1] == student_id and row[2] == book_id)
    ]
    _write_rows(BORROWS_CSV, borrows)
    return {"transaction_id": trans_id, "date": today, "book_id": book_id}


def get_borrowed_books(student_id):
    borrows = _read_rows(BORROWS_CSV)
    books = {b["id"]: b for b in list_books()}
    results = []
    for row in borrows:
        if len(row) < 4:
            continue
        if row[1] != student_id:
            continue
        book = books.get(row[2])
        if book:
            results.append({**book, "borrow_date": row[3], "transaction_id": row[0]})
    return results


def check_fines(student_id):
    borrowed = get_borrowed_books(student_id)
    total = 0
    items = []
    for book in borrowed:
        try:
            borrow_date = datetime.datetime.strptime(book["borrow_date"], "%d-%m-%Y")
        except ValueError:
            borrow_date = datetime.datetime.now()
        current_date = datetime.datetime.now()
        days = (current_date - borrow_date).days
        fine = (days // 7) * 20
        total += fine
        items.append({**book, "days": days, "fine": fine})
    return {"total": total, "items": items}


def deregister_student(student_id):
    if get_borrowed_books(student_id):
        return False, "Please return all borrowed books first."
    fines = check_fines(student_id)
    if fines["total"] > 0:
        return False, "Please clear all fines before deregistering."
    rows = _read_rows(STUDENTS_CSV)
    kept = [row for row in rows if row[0] != student_id]
    _write_rows(STUDENTS_CSV, kept)
    return True, None
