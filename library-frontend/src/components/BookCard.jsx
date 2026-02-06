import React from "react";

export default function BookCard({ book, action }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
          {book.publisher || "Independent"}
        </p>
        <h4 className="mt-2 text-lg font-semibold text-[#1c232b]">
          {book.title}
        </h4>
        <p className="mt-2 text-sm text-[#5a6b7b]">Author: {book.author}</p>
        {book.publish_date && (
          <p className="mt-1 text-xs text-[#5a6b7b]">
            Published: {book.publish_date}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5a6b7b]">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            book.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {book.available ? "Available" : "Issued"}
        </span>
        <span className="rounded-full bg-white/80 px-3 py-1">
          Qty: {book.quantity ?? 0}
        </span>
        {action}
      </div>
    </div>
  );
}
