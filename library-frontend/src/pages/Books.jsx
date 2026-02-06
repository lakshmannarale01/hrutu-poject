import React, { useEffect, useState } from "react";
import { getBooks } from "../api";
import BookCard from "../components/BookCard";


export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((err) => console.error("Books fetch error:", err));
  }, []);

  return (
    <div>
      <h2>Available Books</h2>
      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <ul>
          {books.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}

        </ul>
      )}
    </div>
  );
}
