const BASE_URL = "http://127.0.0.1:8000";

export const login = async (username, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const getBooks = async () => {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error("Books fetch failed");
  return res.json();
};
