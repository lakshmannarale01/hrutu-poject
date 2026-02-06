import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { librarianLogin } from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // 🚨 VERY IMPORTANT

    console.log("Login button clicked"); // debug
    console.log(username, password);     // debug

    try {
      const response = await librarianLogin(username, password);
      console.log("API response:", response);

      if (response.success) {
        navigate("/books");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Librarian Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
