import React, { useEffect, useState } from "react";
import { getLibrarianProfile, updateLibrarianProfile } from "../api";

export default function LibrarianProfile({ user, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editData, setEditData] = useState({
    name: "",
    institution: "",
    department: "",
    address: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      const res = await getLibrarianProfile(user.id);
      if (res.success) {
        setProfile(res.profile);
        setEditData({
          name: res.profile.name || "",
          institution: res.profile.institution || "",
          department: res.profile.department || "",
          address: res.profile.address || "",
        });
      } else {
        setError(res.error || "Unable to load profile.");
      }
      setLoading(false);
    };
    loadProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-[#5a6b7b]">
        Loading librarian profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="glass rounded-3xl p-8 text-sm text-rose-700">
        {error || "Unable to load profile."}
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (
      !editData.name.trim() ||
      !editData.institution.trim() ||
      !editData.department.trim() ||
      !editData.address.trim()
    ) {
      setMessage("All profile fields are required.");
      return;
    }
    const res = await updateLibrarianProfile(user.id, editData);
    if (res.success) {
      setMessage("Profile updated successfully.");
      setProfile((prev) => ({ ...prev, ...res.profile }));
      if (onProfileUpdated) onProfileUpdated(res.profile);
    } else {
      setMessage(res.error || "Profile update failed.");
    }
  };

  const stats = profile.catalog_stats || {
    total_books: 0,
    available_books: 0,
    issued_books: 0,
  };

  return (
    <div className="glass rounded-3xl p-8">
      <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
        Librarian Profile
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[#1c232b]">{profile.name}</h2>
      <p className="mt-2 text-sm text-[#5a6b7b]">ID: {profile.id}</p>
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
          {message && <p className="text-xs text-[#5a6b7b]">{message}</p>}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Total Titles</p>
          <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
            {stats.total_books}
          </p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Available</p>
          <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
            {stats.available_books}
          </p>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">Issued</p>
          <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
            {stats.issued_books}
          </p>
        </div>
      </div>
    </div>
  );
}
