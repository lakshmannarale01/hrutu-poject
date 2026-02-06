from flask import Flask, jsonify, request
from flask_cors import CORS
from auth import authenticate_librarian
from book import view_all_books

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    if authenticate_librarian(data.get("username"), data.get("password")):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401


@app.route("/books", methods=["GET"])
def get_books():
    try:
        return jsonify(view_all_books())
    except Exception as e:
        print("BOOK ERROR:", e)
        return jsonify({"error": "Failed to load books"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000)
