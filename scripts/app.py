from flask import Flask, jsonify, request
from flask_cors import CORS
from auth import authenticate_user, register_student
from library_ops import (
    add_book,
    borrow_book,
    check_fines,
    deregister_student,
    get_librarian_profile,
    get_borrowed_books,
    get_student_profile,
    list_books,
    pay_fine,
    register_librarian,
    remove_book,
    return_book,
    get_librarian_dashboard_data,
    update_librarian_profile,
    update_book,
    update_student_profile,
)

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:4173",
                "http://127.0.0.1:4173",
            ]
        }
    },
)


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    role = data.get("role", "librarian")
    ok, user = authenticate_user(role, data.get("username"), data.get("password"))
    if ok:
        return jsonify({"success": True, "user": user})
    return jsonify({"success": False}), 401


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    ok, error = register_student(
        data.get("student_id"),
        data.get("name"),
        data.get("password"),
        data.get("institution"),
        data.get("department"),
        data.get("year"),
        data.get("address"),
    )
    if ok:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": error}), 400


@app.route("/librarian/register", methods=["POST"])
def librarian_register():
    data = request.json
    required = ["name", "password", "institution", "department", "address"]
    if any(not data.get(field) for field in required):
        return jsonify({"success": False, "error": "All fields are required."}), 400
    librarian_id = register_librarian(
        data.get("name"),
        data.get("password"),
        data.get("institution"),
        data.get("department"),
        data.get("address"),
    )
    return jsonify({"success": True, "id": librarian_id})


@app.route("/books", methods=["GET"])
def get_books():
    try:
        return jsonify(list_books())
    except Exception as e:
        print("BOOK ERROR:", e)
        return jsonify({"error": "Failed to load books"}), 500

@app.route("/books", methods=["POST"])
def create_book():
    data = request.json
    try:
        new_id = add_book(data)
        return jsonify({"success": True, "id": new_id})
    except Exception as e:
        print("ADD BOOK ERROR:", e)
        return jsonify({"success": False, "error": "Failed to add book"}), 500


@app.route("/books/<book_id>", methods=["PUT"])
def edit_book(book_id):
    data = request.json or {}
    updated = update_book(book_id, data)
    if updated:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Book not found"}), 404


@app.route("/books/<book_id>", methods=["DELETE"])
def delete_book(book_id):
    removed = remove_book(book_id)
    if removed:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Book not found"}), 404


@app.route("/students/<student_id>/borrows", methods=["GET"])
def borrowed_books(student_id):
    return jsonify(get_borrowed_books(student_id))


@app.route("/students/borrow", methods=["POST"])
def borrow():
    data = request.json
    result = borrow_book(data.get("student_id"), data.get("book_id"))
    if result:
        return jsonify({"success": True, "data": result})
    return jsonify({"success": False, "error": "Book not available"}), 400


@app.route("/students/return", methods=["POST"])
def return_borrow():
    data = request.json
    result = return_book(data.get("student_id"), data.get("book_id"))
    if result:
        return jsonify({"success": True, "data": result})
    return jsonify({"success": False, "error": "Return failed"}), 400


@app.route("/students/<student_id>/fines", methods=["GET"])
def fines(student_id):
    return jsonify(check_fines(student_id))


@app.route("/students/<student_id>/fines/pay", methods=["POST"])
def fine_payment(student_id):
    data = request.json or {}
    try:
        amount = float(data.get("amount", 0))
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Invalid amount."}), 400
    ok, error, payment = pay_fine(
        student_id,
        amount,
        data.get("method", "qr"),
        data.get("reference", ""),
    )
    if ok:
        return jsonify({"success": True, "payment": payment})
    return jsonify({"success": False, "error": error}), 400


@app.route("/students/<student_id>/profile", methods=["GET"])
def student_profile(student_id):
    profile = get_student_profile(student_id)
    if not profile:
        return jsonify({"success": False, "error": "Student not found"}), 404
    return jsonify({"success": True, "profile": profile})


@app.route("/students/<student_id>/profile", methods=["PUT"])
def student_profile_update(student_id):
    data = request.json or {}
    try:
        ok, error, updated = update_student_profile(student_id, data)
    except PermissionError as e:
        return jsonify({"success": False, "error": str(e)}), 423
    if not ok:
        code = 404 if error == "Student not found." else 400
        return jsonify({"success": False, "error": error}), code
    return jsonify({"success": True, "profile": updated})


@app.route("/librarians/<librarian_id>/profile", methods=["GET"])
def librarian_profile(librarian_id):
    profile = get_librarian_profile(librarian_id)
    if not profile:
        return jsonify({"success": False, "error": "Librarian not found"}), 404
    return jsonify({"success": True, "profile": profile})


@app.route("/librarians/<librarian_id>/profile", methods=["PUT"])
def librarian_profile_update(librarian_id):
    data = request.json or {}
    try:
        ok, error, updated = update_librarian_profile(librarian_id, data)
    except PermissionError as e:
        return jsonify({"success": False, "error": str(e)}), 423
    if not ok:
        code = 404 if error == "Librarian not found." else 400
        return jsonify({"success": False, "error": error}), code
    return jsonify({"success": True, "profile": updated})


@app.route("/librarians/dashboard", methods=["GET"])
def librarian_dashboard():
    return jsonify({"success": True, "data": get_librarian_dashboard_data()})


@app.route("/students/<student_id>/deregister", methods=["POST"])
def deregister(student_id):
    ok, error = deregister_student(student_id)
    if ok:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": error}), 400

if __name__ == "__main__":
    app.run(debug=True, port=8000)
