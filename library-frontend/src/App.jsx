import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import LibrarianSignup from "./pages/LibrarianSignup";
import StudentProfile from "./pages/StudentProfile";
import LibrarianProfile from "./pages/LibrarianProfile";

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
        <div className="mx-auto max-w-6xl color-[#1c232b]/80 mb-10 rounded-lg bg-gradient-to-br from-[#0f4c5c]/20 to-[#2a9d8f]/20 p-6 text-center text-sm font-medium shadow">
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
            <Route
              path="/student-profile"
              element={
                loggedIn && auth?.role === "student" ? (
                  <StudentProfile
                    user={auth}
                    onProfileUpdated={(profile) =>
                      setAuth((prev) => ({ ...prev, ...profile }))
                    }
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/librarian-profile"
              element={
                loggedIn && auth?.role === "librarian" ? (
                  <LibrarianProfile
                    user={auth}
                    onProfileUpdated={(profile) =>
                      setAuth((prev) => ({ ...prev, ...profile }))
                    }
                  />
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




