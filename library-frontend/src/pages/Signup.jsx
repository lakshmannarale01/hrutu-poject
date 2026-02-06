import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [data, setData] = useState({ email: "", password: "" });

  const handle = async () => {
    try {
      await axios.post("http://localhost:8000/signup", data);
      alert("Signup success");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>
        <input 
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setData({...data, email:e.target.value})}
        />
        <input 
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={(e)=>setData({...data, password:e.target.value})}
        />
        <button onClick={handle} className="bg-blue-600 text-white w-full p-2">Signup</button>
      </div>
    </div>
  );
}
