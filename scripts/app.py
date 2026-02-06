from flask import Flask, jsonify
from flask_cors import CORS

from book import view_all_books  # ✅ correct import

app = Flask(__name__)
CORS(app)


@app.route("/books", methods=["GET"])
def get_books():
    books = view_all_books()     # ✅ now defined
    return jsonify(books)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
