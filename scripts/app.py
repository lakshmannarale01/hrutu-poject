from flask import Flask, jsonify, request
from flask_cors import CORS

import book
import student
import librarian

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Library API running"})

@app.route("/books", methods=["GET"])
def get_books():
    books = book_mod.view_all_books()

    formatted = []
    for row in books:
        formatted.append({
            "id": row[0],
            "title": row[3],
            "author": row[4],
            "publisher": row[5],
            "available": row[6] == "True"
        })

    return jsonify(formatted)


@app.route("/student/login", methods=["POST"])
def student_login():
    data = request.json
    if student.login_student(data["username"], data["password"]):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/librarian/login", methods=["POST"])
def librarian_login():
    data = request.json
    if librarian.login_librarian(data["username"], data["password"]):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

if __name__ == "__main__":
    app.run(debug=True, port=8000)
