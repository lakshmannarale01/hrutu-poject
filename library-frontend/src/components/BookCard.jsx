import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-xl">{book.title}</h3>
      <p className="text-sm mt-1">{book.author}</p>
      <p className="mt-2 text-gray-600">{book.description}</p>
      <p className="mt-2 font-semibold">Status: {book.available ? "Available" : "Issued"}</p>
    </div>
  );
}
