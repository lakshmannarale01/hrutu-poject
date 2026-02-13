import React from "react";
import { NavLink } from "react-router-dom";

const linkBase =
  "text-sm font-semibold text-[#1c232b]/80 transition hover:text-[#0f4c5c]";
const linkActive = "text-[#0f4c5c]";

export default function Navbar({ loggedIn, role, userName, onLogout }) {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/30 bg-white/60 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#0f4c5c] to-[#2a9d8f] shadow-lg" />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#5a6b7b]">Library</p>
            <h1 className="text-lg font-semibold text-[#1c232b]">MGM Library</h1>
          </div>
        </NavLink>

        <div className="flex flex-wrap items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
          >
            Books
          </NavLink>
          {role === "librarian" && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
            >
              Dashboard
            </NavLink>
          )}
          {!loggedIn && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                Signup
              </NavLink>
              <NavLink
                to="/librarian-register"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ""}`
                }
              >
                Librarian Register
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[#5a6b7b] md:inline">
            {loggedIn
              ? `${userName || "User"} · ${role === "librarian" ? "Librarian" : "Student"}`
              : "Staff portal"}
          </span>
          {loggedIn ? (
            <button
              onClick={onLogout}
              className="rounded-full border border-[#1c232b]/20 px-4 py-2 text-sm font-semibold text-[#1c232b] transition hover:border-[#1c232b]/40 hover:bg-white"
            >
              Logout
            </button>
          ) : (
            <NavLink>
              
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
