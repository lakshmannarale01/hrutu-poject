import React, { useEffect, useState } from "react";
import { getStudentProfile, payFine, updateStudentProfile } from "../api";

const QR_IMAGE_PATH = "/student-fine-qr.png";

export default function StudentProfile({ user, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [showQrFallback, setShowQrFallback] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    institution: "",
    department: "",
    year: "",
    address: "",
  });

  const loadProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await getStudentProfile(user.id);
    if (res.success) {
      setProfile(res.profile);
      setEditData({
        name: res.profile.name || "",
        institution: res.profile.institution || "",
        department: res.profile.department || "",
        year: res.profile.year || "",
        address: res.profile.address || "",
      });
    } else {
      setMessage(res.error || "Unable to load profile.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handlePayFine = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }
    const res = await payFine(user.id, numericAmount, reference);
    if (res.success) {
      setMessage(
        `Payment successful. Remaining due: Rs. ${res.payment.remaining_due.toFixed(2)}`
      );
      setAmount("");
      setReference("");
      await loadProfile();
    } else {
      setMessage(res.error || "Payment failed.");
    }
  };

  const handleSaveProfile = async () => {
    if (
      !editData.name.trim() ||
      !editData.institution.trim() ||
      !editData.department.trim() ||
      !editData.year.trim() ||
      !editData.address.trim()
    ) {
      setMessage("All profile fields are required.");
      return;
    }
    const res = await updateStudentProfile(user.id, editData);
    if (res.success) {
      setMessage("Profile updated successfully.");
      await loadProfile();
      if (onProfileUpdated) onProfileUpdated(res.profile);
    } else {
      setMessage(res.error || "Profile update failed.");
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-[#5a6b7b]">
        Loading student profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-rose-700">
        Unable to load student profile.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <section className="glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
          Student Profile
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#1c232b]">
          {profile.name}
        </h2>
        <p className="mt-2 text-sm text-[#5a6b7b]">
          ID: {profile.id}
        </p>
        <div className="mt-4 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-[#1c232b]">
          <div className="grid gap-3">
            <label>
              <span className="font-semibold">ID (read only)</span>
              <input
                value={profile.id}
                disabled
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-gray-100 px-3 py-2 text-sm text-[#1c232b]"
              />
            </label>
            <label>
              <span className="font-semibold">Name</span>
              <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-white px-3 py-2 text-sm text-[#1c232b]"
              />
            </label>
            <label>
              <span className="font-semibold">College / Institute</span>
              <input
                value={editData.institution}
                onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-white px-3 py-2 text-sm text-[#1c232b]"
              />
            </label>
            <label>
              <span className="font-semibold">Department</span>
              <input
                value={editData.department}
                onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-white px-3 py-2 text-sm text-[#1c232b]"
              />
            </label>
            <label>
              <span className="font-semibold">Year</span>
              <select
                value={editData.year}
                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-white px-3 py-2 text-sm text-[#1c232b]"
              >
                <option value="">Select year</option>
                <option value="1st year">1st year</option>
                <option value="2nd year">2nd year</option>
                <option value="3rd year">3rd year</option>
                <option value="4th year">4th year</option>
              </select>
            </label>
            <label>
              <span className="font-semibold">Address</span>
              <textarea
                rows={2}
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#1c232b]/10 bg-white px-3 py-2 text-sm text-[#1c232b]"
              />
            </label>
            <button
              onClick={handleSaveProfile}
              className="mt-1 w-fit rounded-full bg-[#0f4c5c] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0d3d4b]"
            >
              Save profile
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Borrowed</p>
            <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
              {profile.borrowed_count}
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Gross Fine</p>
            <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
              Rs. {profile.fines.gross_total}
            </p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Due Fine</p>
            <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
              Rs. {profile.fines.total}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
            Borrowed books
          </p>
          {profile.borrowed_books.length === 0 ? (
            <p className="mt-2 text-sm text-[#1c232b]">No active borrows.</p>
          ) : (
            <div className="mt-3 grid gap-2">
              {profile.borrowed_books.map((book) => (
                <div
                  key={book.transaction_id}
                  className="rounded-xl border border-white/70 bg-white p-3 text-sm"
                >
                  <p className="font-semibold text-[#1c232b]">{book.title}</p>
                  <p className="text-xs text-[#5a6b7b]">Borrowed: {book.borrow_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="glass rounded-3xl p-8">
        <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
          Fine Payment
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-[#1c232b]">Pay via QR Code</h3>
        <p className="mt-2 text-sm text-[#5a6b7b]">
          Scan the QR and enter paid amount with transaction reference.
        </p>
        {!showQrFallback ? (
          <img
            src={QR_IMAGE_PATH}
            alt="Fine payment QR"
            onError={() => setShowQrFallback(true)}
            className="mt-4 h-56 w-56 rounded-2xl border border-white/60 bg-white p-2"
          />
        ) : (
          <div className="mt-4 flex h-56 w-56 items-center justify-center rounded-2xl border border-dashed border-[#1c232b]/20 bg-white/70 p-4 text-center text-xs text-[#5a6b7b]">
            Add your QR image at /public/student-fine-qr.png
          </div>
        )}

        <div className="mt-4 grid gap-3">
          <input
            type="number"
            min="1"
            placeholder="Amount (Rs.)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
          />
          <input
            placeholder="Payment reference (UTR / Txn ID)"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
          />
          <button
            onClick={handlePayFine}
            className="rounded-full bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0d3d4b]"
          >
            Submit fine payment
          </button>
        </div>

        <p className="mt-4 text-xs text-[#5a6b7b]">
          Paid so far: Rs. {profile.fines.paid} | Remaining due: Rs. {profile.fines.total}
        </p>

        {message && (
          <p className="mt-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-[#1c232b]">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}
