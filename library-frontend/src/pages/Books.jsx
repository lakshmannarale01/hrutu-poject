import React, { useEffect, useState } from "react";
import api from "../api";
import BookCard from "../components/BookCard";

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Available Books</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
