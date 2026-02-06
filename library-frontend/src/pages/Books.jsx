import React, { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="p-6">Loading books...</p>;
  }

  if (books.length === 0) {
    return <p className="p-6">No books available</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Books</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            {Object.entries(book).map(([key, value]) => (
              <p key={key} className="text-sm">
                <span className="font-semibold">{key}:</span>{" "}
                {String(value)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
