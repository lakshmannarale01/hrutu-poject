import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import LibrarianSignup from "./pages/LibrarianSignup";

function App() {
  const [auth, setAuth] = useState(null);
  const loggedIn = Boolean(auth);

  return (
    <div className="min-h-screen">
      <Navbar
        loggedIn={loggedIn}
        role={auth?.role}
        userName={auth?.name}
        onLogout={() => setAuth(null)}
      />
      <main className="px-4 sm:px-8 lg:px-12 py-10">
        <div className="mx-auto max-w-6xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login onLogin={(user) => setAuth(user)} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/librarian-register" element={<LibrarianSignup />} />
            <Route
              path="/books"
              element={
                loggedIn ? (
                  <Books role={auth?.role} user={auth} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                loggedIn && auth?.role === "librarian" ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;




