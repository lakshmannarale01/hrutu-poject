import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerLibrarian } from "../api";

export default function LibrarianSignup() {
  const [data, setData] = useState({
    name: "",
    institution: "",
    department: "",
    address: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handle = async () => {
    const res = await registerLibrarian(data);
    if (res.success) {
      setMessage(`Librarian registered. Your ID is ${res.id}.`);
      setData({
        name: "",
        institution: "",
        department: "",
        address: "",
        password: "",
      });
    } else {
      setMessage(res.error || "Registration failed.");
    }
  };

  return (
    <div className="glass mx-auto max-w-lg rounded-3xl p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
        Librarian Access
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[#1c232b]">
        Register a librarian
      </h2>
      <div className="mt-6 grid gap-4">
        <label className="text-sm font-semibold text-[#1c232b]">
          Name
          <input
            placeholder="Full name"
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          College / Institute
          <input
            placeholder="e.g. MGM University"
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            value={data.institution}
            onChange={(e) => setData({ ...data, institution: e.target.value })}
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Department
          <input
            placeholder="e.g. Library Sciences"
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            value={data.department}
            onChange={(e) => setData({ ...data, department: e.target.value })}
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Address
          <textarea
            placeholder="Enter address"
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            rows={3}
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Password
          <input
            type="password"
            placeholder="Create a secure password"
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </label>
        <button
          onClick={handle}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[#e36414] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e36414]/30 transition hover:-translate-y-0.5 hover:bg-[#c45412]"
        >
          Register librarian
        </button>
        {message && (
          <p className="rounded-2xl border border-[#1c232b]/10 bg-white/70 px-4 py-3 text-sm text-[#1c232b]">
            {message}
          </p>
        )}
        <p className="text-sm text-[#5a6b7b]">
          Already have an account?{" "}
          <Link to="/login?role=librarian" className="font-semibold text-[#0f4c5c]">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
