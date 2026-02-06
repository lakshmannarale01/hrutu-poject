import React from "react";

export default function Dashboard() {
  return (
    <div className="glass rounded-3xl p-8 sm:p-10">
      <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
        Admin Suite
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-[#1c232b]">
        Operations dashboard
      </h2>
      <p className="mt-3 text-base text-[#5a6b7b]">
        Track lending trends, manage inventory, and configure staff roles.
      </p>
    </div>
  );
}
