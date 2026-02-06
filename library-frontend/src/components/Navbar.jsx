import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">📚 Library System</h1>
      <div className="space-x-4">
        <Link to="/books" className="hover:underline">Books</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </div>
    </nav>
  );
}
