import React from "react";

export default function BookCard({ book }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
      <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
      <p className="text-sm text-gray-600">Author: {book.author}</p>
      <p className="text-sm text-gray-600">Publisher: {book.publisher}</p>
      <span
        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
          book.available
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {book.available ? "Available" : "Issued"}
      </span>
    </div>
  );
}
