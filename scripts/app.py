from flask import Flask, jsonify
from flask_cors import CORS
from book import view_all_books

app = Flask(__name__)
CORS(app)  # ✅ IMPORTANT: allow frontend calls


@app.route("/books", methods=["GET"])
def get_books():
    books = view_all_books()
    return jsonify(books)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
