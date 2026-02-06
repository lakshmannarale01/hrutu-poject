import React, { useState } from "react";
import Login from "./pages/Login";
import Books from "./pages/Books";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? (
    <Books />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} />
  );
}

export default App;
