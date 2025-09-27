import React, { useState } from "react";
import "./App.css";

function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(username, password);
    if (username !== "admin" || password !== "password") {
      setError("Invalid credentials. Try admin / password.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={submitHandler} className="login-box">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
