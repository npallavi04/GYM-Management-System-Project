import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Attendance from "./components/Attendance";
import Payments from "./components/Payments";
import Charts from "./components/Charts";
import Trainers from "./components/Trainers";
import "./App.css";


function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setPage("dashboard");
  }, []);


  return (
    <div className="container">
      <h1>🏋️ Gym Management System</h1>

      <nav>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("attendance")}>Attendance</button>
        <button onClick={() => setPage("payments")}>Payments</button>
        <button onClick={() => setPage("charts")}>Charts</button>
        <button onClick={() => setPage("trainers")}>Trainers</button>
        
      </nav>

      {page === "login" && <Login setPage={setPage}  setUsername={setUsername} setRole={setRole}/>  }
      {page === "register" && <Register setPage={setPage}  setUsername={setUsername} setRole={setRole}/>}
      {page === "dashboard" && <Dashboard role={role} username={username} />}
      {page === "attendance" && <Attendance username={username} />}
      {page === "payments" && <Payments username={username} />}
      {page === "charts" && <Charts />}
      {page === "trainers" && <Trainers username={username} />}

    
    </div>
  );
}

export default App;
