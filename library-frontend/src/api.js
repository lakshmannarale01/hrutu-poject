const BASE_URL = "http://127.0.0.1:8000";

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  return res.json();
}

export async function addBook(book) {
  const res = await fetch("http://127.0.0.1:8000/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
}
