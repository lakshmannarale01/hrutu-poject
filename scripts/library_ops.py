import csv
import datetime
import os
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
BOOKS_CSV = os.path.join(DATA_DIR, "books.csv")
BORROWS_CSV = os.path.join(DATA_DIR, "all_borrows.csv")
TRANSACTIONS_CSV = os.path.join(DATA_DIR, "all_transactions.csv")
STUDENTS_CSV = os.path.join(DATA_DIR, "students.csv")
LIBRARIAN_CSV = os.path.join(DATA_DIR, "librarian.csv")
FINE_PAYMENTS_CSV = os.path.join(DATA_DIR, "fine_payments.csv")


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
    last_error = None
    for _ in range(5):
        try:
            with open(path, "w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerows(rows)
            return
        except PermissionError as error:
            last_error = error
            time.sleep(0.2)
    raise PermissionError(
        f"Unable to write file '{path}'. Close any app using it (Excel/OneDrive sync) and try again."
    ) from last_error


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


def register_librarian(name, password, institution, department, address):
    rows = _read_rows(LIBRARIAN_CSV)
    librarian_id = _next_id("lb", rows)
    rows.append(
        [
            librarian_id,
            name.strip(),
            password.strip(),
            institution.strip(),
            department.strip(),
            address.strip(),
        ]
    )
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
    paid = 0
    payments = []
    for row in _read_rows(FINE_PAYMENTS_CSV):
        if len(row) < 5 or row[1] != student_id:
            continue
        amount = float(row[2]) if row[2] else 0.0
        paid += amount
        payments.append(
            {
                "payment_id": row[0],
                "amount": amount,
                "paid_on": row[3],
                "method": row[4],
                "reference": row[5] if len(row) > 5 else "",
            }
        )
    due = max(0.0, total - paid)
    return {"total": due, "gross_total": total, "paid": paid, "items": items, "payments": payments}


def pay_fine(student_id, amount, method="qr", reference=""):
    fines = check_fines(student_id)
    due = fines["total"]
    if due <= 0:
        return False, "No pending fine.", None
    if amount <= 0:
        return False, "Amount must be greater than zero.", None
    if amount > due:
        return False, f"Amount exceeds due fine. Current due is Rs. {due:.2f}.", None

    rows = _read_rows(FINE_PAYMENTS_CSV)
    payment_id = _next_id("fp", rows)
    today = _today()
    rows.append([payment_id, student_id, f"{amount:.2f}", today, method, reference.strip()])
    _write_rows(FINE_PAYMENTS_CSV, rows)
    updated = check_fines(student_id)
    return True, None, {
        "payment_id": payment_id,
        "amount": amount,
        "paid_on": today,
        "remaining_due": updated["total"],
    }


def get_student_profile(student_id):
    student = None
    for row in _read_rows(STUDENTS_CSV):
        if len(row) < 4:
            continue
        if row[0] == student_id:
            if len(row) > 6:
                institution = row[3]
                department = row[4]
                year = row[5]
                address = row[6]
            else:
                institution = ""
                department = row[3] if len(row) > 3 else ""
                year = ""
                address = ""
            student = {
                "id": row[0],
                "name": row[1],
                "institution": institution,
                "department": department,
                "year": year,
                "address": address,
                "role": "student",
            }
            break
    if not student:
        return None

    borrows = get_borrowed_books(student_id)
    fines = check_fines(student_id)
    return {
        **student,
        "borrowed_count": len(borrows),
        "borrowed_books": borrows,
        "fines": fines,
    }


def get_librarian_profile(librarian_id):
    librarian = None
    for row in _read_rows(LIBRARIAN_CSV):
        if len(row) < 2:
            continue
        if row[0] == librarian_id:
            # Supports both:
            # new format: id,name,password,institution,department,address
            # old format: id,name,password,institution,department,year,address
            if len(row) > 6:
                address = row[6]
            elif len(row) > 5:
                address = row[5]
            else:
                address = ""
            librarian = {
                "id": row[0],
                "name": row[1],
                "institution": row[3] if len(row) > 3 else "",
                "department": row[4] if len(row) > 4 else "",
                "address": address,
                "role": "librarian",
            }
            break
    if not librarian:
        return None

    books = list_books()
    total = len(books)
    available = len([book for book in books if book["available"]])
    issued = total - available
    return {
        **librarian,
        "catalog_stats": {
            "total_books": total,
            "available_books": available,
            "issued_books": issued,
        },
    }


def update_student_profile(student_id, payload):
    rows = _read_rows(STUDENTS_CSV)
    updated = None
    for idx, row in enumerate(rows):
        if len(row) < 4:
            continue
        if row[0] != student_id:
            continue

        if len(row) > 6:
            institution = row[3]
            department = row[4]
            year = row[5]
            address = row[6]
        else:
            institution = ""
            department = row[3] if len(row) > 3 else ""
            year = ""
            address = ""

        next_row = [
            row[0],
            payload.get("name", row[1]).strip(),
            row[2],  # do not edit password in profile flow
            payload.get("institution", institution).strip(),
            payload.get("department", department).strip(),
            payload.get("year", year).strip(),
            payload.get("address", address).strip(),
        ]
        if not all([next_row[1], next_row[3], next_row[4], next_row[5], next_row[6]]):
            return False, "All profile fields are required.", None
        rows[idx] = next_row
        updated = {
            "id": next_row[0],
            "name": next_row[1],
            "institution": next_row[3],
            "department": next_row[4],
            "year": next_row[5],
            "address": next_row[6],
            "role": "student",
        }
        break

    if updated is None:
        return False, "Student not found.", None

    _write_rows(STUDENTS_CSV, rows)
    return True, None, updated


def update_librarian_profile(librarian_id, payload):
    rows = _read_rows(LIBRARIAN_CSV)
    updated = None
    for idx, row in enumerate(rows):
        if len(row) < 3:
            continue
        if row[0] != librarian_id:
            continue

        institution = row[3] if len(row) > 3 else ""
        department = row[4] if len(row) > 4 else ""
        if len(row) > 6:
            address = row[6]
        elif len(row) > 5:
            address = row[5]
        else:
            address = ""

        next_row = [
            row[0],
            payload.get("name", row[1]).strip(),
            row[2],  # do not edit password in profile flow
            payload.get("institution", institution).strip(),
            payload.get("department", department).strip(),
            payload.get("address", address).strip(),
        ]
        if not all([next_row[1], next_row[3], next_row[4], next_row[5]]):
            return False, "All profile fields are required.", None
        rows[idx] = next_row
        updated = {
            "id": next_row[0],
            "name": next_row[1],
            "institution": next_row[3],
            "department": next_row[4],
            "address": next_row[5],
            "role": "librarian",
        }
        break

    if updated is None:
        return False, "Librarian not found.", None

    _write_rows(LIBRARIAN_CSV, rows)
    return True, None, updated


def get_librarian_dashboard_data():
    books = list_books()
    total_books = len(books)
    available_books = len([book for book in books if book["available"]])
    issued_books = total_books - available_books

    students = []
    total_due_fines = 0.0
    for row in _read_rows(STUDENTS_CSV):
        if len(row) < 4:
            continue
        student_id = row[0]
        if len(row) > 6:
            institution = row[3]
            department = row[4]
            year = row[5]
            address = row[6]
        else:
            institution = ""
            department = row[3]
            year = ""
            address = ""
        borrows = get_borrowed_books(student_id)
        fines = check_fines(student_id)
        total_due_fines += fines["total"]
        students.append(
            {
                "id": student_id,
                "name": row[1] if len(row) > 1 else "",
                "institution": institution,
                "department": department,
                "year": year,
                "address": address,
                "borrowed_count": len(borrows),
                "due_fine": fines["total"],
            }
        )

    payments = []
    for row in _read_rows(FINE_PAYMENTS_CSV):
        if len(row) < 5:
            continue
        payments.append(
            {
                "payment_id": row[0],
                "student_id": row[1],
                "amount": float(row[2]) if row[2] else 0.0,
                "paid_on": row[3],
                "method": row[4],
                "reference": row[5] if len(row) > 5 else "",
            }
        )

    payments.sort(key=lambda item: item["payment_id"], reverse=True)
    return {
        "stats": {
            "total_books": total_books,
            "available_books": available_books,
            "issued_books": issued_books,
            "active_students": len(students),
            "active_borrows": len(_read_rows(BORROWS_CSV)),
            "total_due_fines": total_due_fines,
        },
        "students": students,
        "recent_payments": payments[:25],
    }


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
