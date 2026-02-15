import React, { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import LibrarianSignup from "./pages/LibrarianSignup";
import StudentProfile from "./pages/StudentProfile";
import LibrarianProfile from "./pages/LibrarianProfile";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep a console trace for debugging route/page crashes.
    console.error("Route render error:", error);
    this.setState({ errorMessage: error?.message || "Unknown rendering error." });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: "" });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass rounded-3xl p-8 text-sm text-rose-700">
          Something went wrong while rendering this page. Refresh once. If it
          still fails, log out and sign in again.
          {this.state.errorMessage ? (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-100 px-3 py-2 text-xs text-rose-800">
              Error: {this.state.errorMessage}
            </p>
          ) : null}
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const location = useLocation();
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem("library_auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const loggedIn = Boolean(auth);

  const handleLogin = (user) => {
    setAuth(user);
    localStorage.setItem("library_auth", JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("library_auth");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(12, 28, 36, 0.55), rgba(12, 28, 36, 0.55)), url('/library%20main%20pics.avif')",
      }}
    >
      <Navbar
        loggedIn={loggedIn}
        role={auth?.role}
        userName={auth?.name}
        onLogout={handleLogout}
      />
      <main className="px-4 sm:px-8 lg:px-12 py-10">
        <div className="mx-auto mb-10 max-w-6xl rounded-lg bg-gradient-to-br from-[#0f4c5c]/20 to-[#2a9d8f]/20 p-6 text-center text-sm font-medium text-[#1c232b]/80 shadow">
          <AppErrorBoundary resetKey={location.pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={<Login onLogin={handleLogin} />}
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
          </AppErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;



