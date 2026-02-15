import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = useMemo(() => {
    const current = searchParams.get("role");
    return current === "librarian" ? "librarian" : "student";
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("role")) {
      setSearchParams({ role: "student" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleLogin = async () => {
    try {
      const res = await login(username, password, role);
      if (res.success) {
        onLogin(res.user);
        navigate(role === "librarian" ? "/dashboard" : "/books");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Server error. Please check the backend connection.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="glass animate-fade-up rounded-3xl p-8 sm:p-10">
        <div className="max-w-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({ role: "librarian" })}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                role === "librarian"
                  ? "bg-[#0f4c5c] text-white shadow"
                  : "bg-white/70 text-[#5a6b7b]"
              }`}
            >
              Librarian
            </button>
            <button
              onClick={() => setSearchParams({ role: "student" })}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                role === "student"
                  ? "bg-[#0f4c5c] text-white shadow"
                  : "bg-white/70 text-[#5a6b7b]"
              }`}
            >
              Student
            </button>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-[#1c232b] sm:text-4xl">
            {role === "librarian"
              ? "Welcome back to your catalog"
              : "Welcome back to the library"}
          </h2>
          <p className="mt-3 text-base text-[#5a6b7b]">
            {role === "librarian"
              ? "Manage checkouts, onboard new titles, and keep your collection perfectly organized."
              : "Browse the catalog, track availability, and discover new arrivals."}
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <label className="text-sm font-semibold text-[#1c232b]">
            Username or ID
            <input
              placeholder={role === "librarian" ? "Enter staff ID or name" : "Enter student ID or name"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            />
          </label>

          <label className="text-sm font-semibold text-[#1c232b]">
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            />
          </label>

          <button
            onClick={handleLogin}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#0f4c5c] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f4c5c]/30 transition hover:-translate-y-0.5 hover:bg-[#0d3d4b]"
          >
            Sign in
          </button>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {role === "student" && (
            <p className="text-sm text-[#5a6b7b]">
              New student?{" "}
              <Link to="/signup" className="font-semibold text-[#0f4c5c]">
                Create an account
              </Link>
            </p>
          )}
          {role === "librarian" && (
            <p className="text-sm text-[#5a6b7b]">
              New librarian?{" "}
              <Link
                to="/librarian-register"
                className="font-semibold text-[#0f4c5c]"
              >
                Register here
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="glass animate-fade-up relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#e36414]/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#0f4c5c]/15 blur-2xl" />

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-[#5a6b7b]">
            Library Features
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[#1c232b]">
            Built for your current workflow
          </h3>

          <div className="mt-6 grid gap-4">
            {(role === "librarian"
              ? [
                  { label: "Add, update, remove books", value: "Catalog" },
                  { label: "Track availability", value: "Live stock" },
                  { label: "Manage profile details", value: "Editable" },
                ]
              : [
                  { label: "Borrow and return books", value: "Student flow" },
                  { label: "Pay fines using QR", value: "Integrated" },
                  { label: "Maintain your profile", value: "Editable" },
                ]
            ).map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-sm"
              >
                <span className="text-sm text-[#5a6b7b]">{stat.label}</span>
                <span className="text-lg font-semibold text-[#1c232b]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
              Project scope
            </p>
            <p className="mt-2 text-sm text-[#1c232b]">
              Role-based login, book management, profile management, and fine payment are all part of this project.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
