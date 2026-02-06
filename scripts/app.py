from flask import Flask, jsonify, request
from flask_cors import CORS
from auth import authenticate_user, register_student
from library_ops import (
    add_book,
    borrow_book,
    check_fines,
    deregister_student,
    get_borrowed_books,
    list_books,
    register_librarian,
    remove_book,
    return_book,
    update_book,
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


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
        data.get("student_id"), data.get("name"), data.get("password"), data.get("department")
    )
    if ok:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": error}), 400


@app.route("/librarian/register", methods=["POST"])
def librarian_register():
    data = request.json
    if not data.get("name") or not data.get("password"):
        return jsonify({"success": False, "error": "Name and password required."}), 400
    librarian_id = register_librarian(data.get("name"), data.get("password"))
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


@app.route("/students/<student_id>/deregister", methods=["POST"])
def deregister(student_id):
    ok, error = deregister_student(student_id)
    if ok:
        return jsonify({"success": True})
    return jsonify({"success": False, "error": error}), 400

if __name__ == "__main__":
    app.run(debug=True, port=8000)
