import { useState } from "react";
import { addBook } from "../api";

export default function AddBook({ onAdded }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState("");

  const handleAdd = async () => {
    if (!title || !author) {
      setStatus("Title and author are required.");
      return;
    }
    await addBook({ title, author, publisher, publish_date: publishDate, quantity });
    setTitle("");
    setAuthor("");
    setPublisher("");
    setPublishDate("");
    setQuantity("1");
    setStatus("Book added successfully.");
    if (onAdded) onAdded();
  };

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
        New Title
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-[#1c232b]">
        Add a book to the collection
      </h3>
      <p className="mt-2 text-sm text-[#5a6b7b]">
        Keep metadata consistent for quick discovery and reporting.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="text-sm font-semibold text-[#1c232b]">
          Title
          <input
            placeholder="e.g. The Midnight Library"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Author
          <input
            placeholder="e.g. Matt Haig"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Publisher
          <input
            placeholder="e.g. Viking Press"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Publish Date
          <input
            placeholder="DD-MM-YYYY"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
          />
        </label>
        <label className="text-sm font-semibold text-[#1c232b]">
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-base text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20"
          />
        </label>
      </div>

      <button
        onClick={handleAdd}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#e36414] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#e36414]/30 transition hover:-translate-y-0.5 hover:bg-[#c45412]"
      >
        Add book
      </button>

      {status && (
        <p className="mt-4 rounded-2xl border border-[#1c232b]/10 bg-white/70 px-4 py-3 text-sm text-[#1c232b]">
          {status}
        </p>
      )}
    </div>
  );
}
