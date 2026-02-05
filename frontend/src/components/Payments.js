import axios from "axios";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function Payments({ username, role }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [payments, setPayments] = useState([]);
  const [payUsername, setPayUsername] = useState(username); // Default to current user

  // Fetch payments
  const fetchPayments = async () => {
    try {
      let url = `${API}/payments`;
      if (role === "member") {
        // Members see only their payments
        url += `?username=${username}`;
      }
      const res = await axios.get(url);
      setPayments(res.data);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Make a payment
  const makePayment = async () => {
    if (!amount || !date || !payUsername) {
      alert("Please fill all fields");
      return;
    }
    try {
      await axios.post(`${API}/payments`, {
        username: payUsername,
        amount: parseFloat(amount),
        date
      });
      alert("Payment successful");
      setAmount("");
      setDate("");
      fetchPayments(); // Refresh payment list
    } catch (err) {
      console.error("Failed to make payment", err);
      alert("Payment failed");
    }
  };

  return (
    <>
      <h2>Payments</h2>

      <div className="payment-form">
        {role === "admin" && (
          <input
            placeholder="Username"
            value={payUsername}
            onChange={(e) => setPayUsername(e.target.value)}
          />
        )}

        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={makePayment}>Pay</button>
      </div>

      <h3>Payment Records</h3>
      <ul>
        {payments.map((p) => (
          <li key={p.id}>
            {p.username} - ₹{p.amount} - {p.date}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Payments;
