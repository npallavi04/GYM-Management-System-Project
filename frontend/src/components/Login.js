import axios from "axios";
import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Login({ setPage, setUsername, setRole }) {
  const [inputUsername, setInputUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        username: inputUsername,
        password: password
      });

      // save token
      localStorage.setItem("token", res.data.access_token);
       // Save username & role to App state
    setUsername(res.data.username); 
    setRole(res.data.role);

      alert(`Login successful! Welcome ${res.data.username}`);

      setPage("dashboard");
    } catch (error) {
      alert("Invalid username or password");
      console.log(error);
    }
  };

  return (
    <div className="section-box">
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setInputUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
