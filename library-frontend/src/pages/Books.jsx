import React, { useEffect, useState } from "react";
import { getBooks } from "../api";
import BookCard from "../components/BookCard";


export default function Books() {
  const [books, setBooks] = useState([]);

  const loadBooks = () => {
    getBooks().then(setBooks);
  };

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  return (
    <div>
      <h2>Available Books</h2>

      <AddBook onAdded={loadBooks} />

      {books.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
}