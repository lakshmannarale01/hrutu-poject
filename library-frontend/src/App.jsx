import React from "react";
import { Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/books" element={<Books />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
