import React from "react";

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </div>
    </div>
  );
}
