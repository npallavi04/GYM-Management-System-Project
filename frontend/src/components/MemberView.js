import { useState, useEffect } from "react";
import API from "../axiosConfig";

function MemberView() {
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/attendance").then((res) => setAttendance(res.data));
    API.get("/payments").then((res) => setPayments(res.data));
  }, []);

  return (
    <div className="member-view">
      <h3>Member Panel</h3>

      <div className="table-section">
        <h4>Your Attendance</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h4>Your Payments</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberView;
