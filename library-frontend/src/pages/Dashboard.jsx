import React, { useEffect, useState } from "react";
import { getLibrarianDashboard } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await getLibrarianDashboard();
      if (res.success) {
        setData(res.data);
      } else {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-[#5a6b7b]">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-rose-700">
        {error || "Unable to load dashboard."}
      </div>
    );
  }

  const stats = data.stats || {};

  return (
    <div className="grid gap-8">
      <section className="glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
          Librarian Dashboard
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#1c232b]">
          Library operations overview
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Total Books" value={stats.total_books} />
          <Stat label="Available Books" value={stats.available_books} />
          <Stat label="Issued Books" value={stats.issued_books} />
          <Stat label="Active Students" value={stats.active_students} />
          <Stat label="Active Borrows" value={stats.active_borrows} />
          <Stat label="Total Due Fines" value={`Rs. ${stats.total_due_fines || 0}`} />
        </div>
      </section>

      <section className="glass rounded-3xl p-8">
        <h3 className="text-2xl font-semibold text-[#1c232b]">Students overview</h3>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1c232b]/10 text-[#5a6b7b]">
                <th className="px-3 py-2">Student ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Year</th>
                <th className="px-3 py-2">Borrowed</th>
                <th className="px-3 py-2">Due Fine</th>
              </tr>
            </thead>
            <tbody>
              {(data.students || []).map((student) => (
                <tr key={student.id} className="border-b border-[#1c232b]/5">
                  <td className="px-3 py-2">{student.id}</td>
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.department || "-"}</td>
                  <td className="px-3 py-2">{student.year || "-"}</td>
                  <td className="px-3 py-2">{student.borrowed_count}</td>
                  <td className="px-3 py-2">Rs. {student.due_fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass rounded-3xl p-8">
        <h3 className="text-2xl font-semibold text-[#1c232b]">Recent fine payments</h3>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1c232b]/10 text-[#5a6b7b]">
                <th className="px-3 py-2">Payment ID</th>
                <th className="px-3 py-2">Student ID</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Reference</th>
              </tr>
            </thead>
            <tbody>
              {(data.recent_payments || []).map((payment) => (
                <tr key={payment.payment_id} className="border-b border-[#1c232b]/5">
                  <td className="px-3 py-2">{payment.payment_id}</td>
                  <td className="px-3 py-2">{payment.student_id}</td>
                  <td className="px-3 py-2">Rs. {payment.amount}</td>
                  <td className="px-3 py-2">{payment.paid_on}</td>
                  <td className="px-3 py-2">{payment.method}</td>
                  <td className="px-3 py-2">{payment.reference || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#1c232b]">{value ?? 0}</p>
    </div>
  );
}
