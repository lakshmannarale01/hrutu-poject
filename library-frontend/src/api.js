const BASE_URL = "http://127.0.0.1:8000";

export async function getBooks() {
  console.log("Calling /books API");
  const response = await fetch(`${BASE_URL}/books`);
  return response.json();
}

export async function librarianLogin(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return response.json();
}
