from flask import Flask, jsonify, request
from flask_cors import CORS
from auth import authenticate_librarian
from book import view_all_books

app = Flask(__name__)
CORS(app)


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if authenticate_librarian(username, password):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False}), 401


@app.route("/books", methods=["GET"])
def get_books():
    books = view_all_books()
    return jsonify(books)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
