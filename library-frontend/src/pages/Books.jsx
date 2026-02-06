import React, { useEffect, useState } from "react";
import api from "../api";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Books</h2>
      {books.length === 0 && <p>No books</p>}

      {books.map(book => (
        <div key={book.id}>
          <b>{book.title}</b> – {book.author}
        </div>
      ))}
    </div>
  );
}
