from flask import Flask, request, jsonify
from flask_cors import CORS

from book import view_all_books, borrow_book, return_book
from student import student_login
from librarian import librarian_login

app = Flask(__name__)
CORS(app)


@app.route("/books", methods=["GET"])
def get_books():
    return jsonify(view_all_books())


@app.route("/borrow", methods=["POST"])
def borrow():
    data = request.json
    return jsonify(borrow_book(data["book_id"], data["student_id"]))


@app.route("/return", methods=["POST"])
def return_api():
    data = request.json
    return jsonify(return_book(data["book_id"], data["student_id"]))


@app.route("/login/student", methods=["POST"])
def login_student():
    data = request.json
    return jsonify(student_login(data["id"], data["password"]))


@app.route("/login/librarian", methods=["POST"])
def login_librarian():
    data = request.json
    return jsonify(librarian_login(data["id"], data["password"]))


if __name__ == "__main__":
    app.run(debug=True, port=8000)
