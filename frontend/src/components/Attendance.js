import axios from "axios";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function Attendance({ username, role }) {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("present");
  const [attUsername, setAttUsername] = useState(username);
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch attendance
  const fetchAttendance = async () => {
    try {
      let url = `${API}/attendance`;
      if (role === "member") {
        url += `?username=${username}`;
      }
      const res = await axios.get(url);
      setAttendanceList(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Mark attendance
  const markAttendance = async () => {
    if (!date || !attUsername) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(`${API}/attendance`, {
        username: attUsername,
        date,
        status
      });
      alert(`Attendance marked for ${attUsername} on ${date}`);
      setDate("");
      fetchAttendance(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to mark attendance");
    }
  };

  return (
    <>
      <h2>Attendance</h2>

      <div className="attendance-form">
        {role === "admin" && (
          <input
            placeholder="Username"
            value={attUsername}
            onChange={(e) => setAttUsername(e.target.value)}
          />
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>

        <button onClick={markAttendance}>Mark Attendance</button>
      </div>

      <h3>Attendance Records</h3>
      <ul>
        {attendanceList.map((a) => (
          <li key={a.id}>
            {a.username} - {a.date} - {a.status}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Attendance;
