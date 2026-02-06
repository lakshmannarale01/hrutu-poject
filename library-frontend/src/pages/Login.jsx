import React, { useState } from "react";
import { login } from "../api";   // ✅ FIXED PATH

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      if (res.success) {
        onLogin();
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div>
      <h2>Librarian Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}