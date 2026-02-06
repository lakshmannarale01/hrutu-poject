const BASE_URL = "http://127.0.0.1:8000";

export async function login(username, password, role) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  return res.json();
}

export async function signup(student) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  return res.json();
}

export async function registerLibrarian(payload) {
  const res = await fetch(`${BASE_URL}/librarian/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  return res.json();
}

export async function addBook(book) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function updateBook(id, payload) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });
  return res.json();
}

export async function borrowBook(student_id, book_id) {
  const res = await fetch(`${BASE_URL}/students/borrow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id, book_id }),
  });
  return res.json();
}

export async function returnBook(student_id, book_id) {
  const res = await fetch(`${BASE_URL}/students/return`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id, book_id }),
  });
  return res.json();
}

export async function getBorrowedBooks(student_id) {
  const res = await fetch(`${BASE_URL}/students/${student_id}/borrows`);
  return res.json();
}

export async function getFines(student_id) {
  const res = await fetch(`${BASE_URL}/students/${student_id}/fines`);
  return res.json();
}

export async function deregisterStudent(student_id) {
  const res = await fetch(`${BASE_URL}/students/${student_id}/deregister`, {
    method: "POST",
  });
  return res.json();
}
