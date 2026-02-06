import React, { useEffect, useState } from "react";
import { getBooks } from "../api";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Books page mounted");

    getBooks()
      .then((data) => {
        console.log("Books API data:", data);
        setBooks(data);
      })
      .catch((err) => {
        console.error("Books fetch error:", err);
        setError("Failed to load books");
      });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Available Books</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              {Object.keys(books[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                {Object.values(book).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Books;
