import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Books from "./pages/Books";
import Login from "./pages/Login";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
