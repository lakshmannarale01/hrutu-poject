import React, { useState } from "react";
import api from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await api.post("/student/login", { username, password });
      alert("Login successful");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-80 border p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Student Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white w-full p-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
