import React, { useEffect, useMemo, useState } from "react";
import {
  borrowBook,
  deleteBook,
  getBorrowedBooks,
  getBooks,
  getFines,
  returnBook,
  updateBook,
  deregisterStudent,
} from "../api";
import BookCard from "../components/BookCard";
import AddBook from "../components/AddBook";

export default function Books({ role, user }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [borrowed, setBorrowed] = useState([]);
  const [fines, setFines] = useState({ total: 0, items: [] });
  const [status, setStatus] = useState("");
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    publisher: "",
    publish_date: "",
    quantity: "",
  });

  const loadBooks = () => {
    getBooks().then(setBooks);
  };

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  const loadBorrowed = async () => {
    if (role !== "student" || !user?.id) return;
    const data = await getBorrowedBooks(user.id);
    setBorrowed(data);
    const fineData = await getFines(user.id);
    setFines(fineData);
  };

  useEffect(() => {
    loadBorrowed();
  }, [role, user?.id]);

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return books;
    return books.filter((book) =>
      [book.title, book.author, book.publisher]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [books, query]);

  const availableCount = books.filter((book) => book.available).length;

  const handleBorrow = async (bookId) => {
    const res = await borrowBook(user.id, bookId);
    if (res.success) {
      setStatus("Book borrowed successfully.");
      loadBooks();
      loadBorrowed();
    } else {
      setStatus(res.error || "Unable to borrow the book.");
    }
  };

  const handleReturn = async (bookId) => {
    const res = await returnBook(user.id, bookId);
    if (res.success) {
      setStatus("Book returned successfully.");
      loadBooks();
      loadBorrowed();
    } else {
      setStatus(res.error || "Unable to return the book.");
    }
  };

  const handleSelectEdit = (book) => {
    setEditId(book.id);
    setEditForm({
      title: book.title || "",
      author: book.author || "",
      publisher: book.publisher || "",
      publish_date: book.publish_date || "",
      quantity: book.quantity ?? "",
    });
  };

  const handleUpdate = async () => {
    if (!editId) return;
    const res = await updateBook(editId, editForm);
    if (res.success) {
      setStatus("Book updated successfully.");
      loadBooks();
    } else {
      setStatus(res.error || "Update failed.");
    }
  };

  const handleDelete = async (bookId) => {
    const res = await deleteBook(bookId);
    if (res.success) {
      setStatus("Book removed successfully.");
      loadBooks();
    } else {
      setStatus(res.error || "Remove failed.");
    }
  };

  const handleDeregister = async () => {
    const res = await deregisterStudent(user.id);
    if (res.success) {
      setStatus("Account deregistered successfully.");
    } else {
      setStatus(res.error || "Deregistration failed.");
    }
  };

  return (
    <div className="grid gap-8">
      <header className="glass animate-fade-up rounded-3xl p-8 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
              Catalog Overview
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1c232b] sm:text-4xl">
              Manage your collection with clarity
            </h2>
            <p className="mt-3 max-w-2xl text-base text-[#5a6b7b]">
              Track availability, add new titles, and monitor your active
              lending flow in one place.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                Total Titles
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
                {books.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                Available
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
                {availableCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                Issued
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
                {books.length - availableCount}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr]">
        <section className="glass animate-fade-up rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-2xl font-semibold text-[#1c232b]">
              Available Books
            </h3>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, author, publisher"
              className="w-full rounded-full border border-[#1c232b]/10 bg-white px-4 py-2 text-sm text-[#1c232b] shadow-sm outline-none transition focus:border-[#0f4c5c]/60 focus:ring-2 focus:ring-[#0f4c5c]/20 sm:w-72"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={index}
                book={book}
                action={
                  role === "student" && (
                    <button
                      onClick={() => handleBorrow(book.id)}
                      disabled={!book.available}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        book.available
                          ? "bg-[#0f4c5c] text-white hover:bg-[#0d3d4b]"
                          : "cursor-not-allowed bg-gray-200 text-gray-500"
                      }`}
                    >
                      Borrow
                    </button>
                  )
                }
              />
            ))}
            {filteredBooks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#1c232b]/20 bg-white/70 p-6 text-sm text-[#5a6b7b]">
                No matching books yet. Try a different search term.
              </div>
            )}
          </div>
        </section>

        <section className="glass animate-fade-up rounded-3xl p-6 sm:p-8">
          {role === "librarian" ? (
            <div className="grid gap-8">
              <AddBook onAdded={loadBooks} />
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
                  Manage Catalog
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[#1c232b]">
                  Update or remove a book
                </h3>
                <div className="mt-4 grid gap-3">
                  <select
                    value={editId}
                    onChange={(event) => {
                      const selected = books.find(
                        (book) => book.id === event.target.value
                      );
                      if (selected) handleSelectEdit(selected);
                      else setEditId("");
                    }}
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  >
                    <option value="">Select a book</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  />
                  <input
                    placeholder="Author"
                    value={editForm.author}
                    onChange={(e) =>
                      setEditForm({ ...editForm, author: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  />
                  <input
                    placeholder="Publisher"
                    value={editForm.publisher}
                    onChange={(e) =>
                      setEditForm({ ...editForm, publisher: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  />
                  <input
                    placeholder="Publish Date"
                    value={editForm.publish_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, publish_date: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: e.target.value })
                    }
                    className="w-full rounded-2xl border border-[#1c232b]/10 bg-white px-4 py-3 text-sm text-[#1c232b] shadow-sm"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleUpdate}
                      disabled={!editId}
                      className="rounded-full bg-[#0f4c5c] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0d3d4b] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(editId)}
                      disabled={!editId}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-[#5a6b7b]">
                Student View
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#1c232b]">
                Browse and reserve
              </h3>
              <p className="mt-2 text-sm text-[#5a6b7b]">
                Contact the librarian to reserve a book or request a new title.
              </p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                    Borrowed books
                  </p>
                  {borrowed.length === 0 ? (
                    <p className="mt-2 text-sm text-[#1c232b]">
                      You have no borrowed books right now.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-2">
                      {borrowed.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center justify-between rounded-xl border border-white/60 bg-white px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#1c232b]">
                              {book.title}
                            </p>
                            <p className="text-xs text-[#5a6b7b]">
                              Borrowed: {book.borrow_date}
                            </p>
                          </div>
                          <button
                            onClick={() => handleReturn(book.id)}
                            className="rounded-full bg-[#0f4c5c] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#0d3d4b]"
                          >
                            Return
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                    Fine summary
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#1c232b]">
                    Rs. {fines.total}
                  </p>
                  <p className="text-xs text-[#5a6b7b]">
                    Fines apply after 7 days (Rs. 20 per week).
                  </p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5a6b7b]">
                    Deregister
                  </p>
                  <p className="mt-2 text-sm text-[#1c232b]">
                    You must return all books and clear fines before leaving.
                  </p>
                  <button
                    onClick={handleDeregister}
                    className="mt-3 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Deregister account
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      {status && (
        <div className="glass animate-fade-up rounded-2xl px-4 py-3 text-sm text-[#1c232b]">
          {status}
        </div>
      )}
    </div>
  );
}
