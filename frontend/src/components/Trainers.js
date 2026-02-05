import axios from "axios";
import { useEffect, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function Trainers({ role }) {
  const [trainers, setTrainers] = useState([]);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all trainers
  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${API}/trainers`);
      setTrainers(res.data);
    } catch (err) {
      console.error("Failed to fetch trainers", err);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Add or update trainer (admin only)
  const saveTrainer = async () => {
    if (!name || !specialization) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        // Update functionality can be implemented in backend
        await axios.put(`${API}/trainers/${editId}`, {
          name,
          specialization
        });
        alert("Trainer updated successfully");
        setEditId(null);
      } else {
        await axios.post(`${API}/trainers`, {
          name,
          specialization
        });
        alert("Trainer added successfully");
      }
      setName("");
      setSpecialization("");
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to save trainer");
    }
  };

  // Delete trainer (admin only)
  const deleteTrainer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;

    try {
      await axios.delete(`${API}/trainers/${id}`);
      alert("Trainer deleted successfully");
      fetchTrainers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete trainer");
    }
  };

  // Set form for editing
  const editTrainer = (trainer) => {
    setEditId(trainer.id);
    setName(trainer.name);
    setSpecialization(trainer.specialization);
  };

  return (
    <>
      <h2>Trainers</h2>

      {role === "admin" && (
        <div className="trainer-form">
          <input
            placeholder="Trainer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
          <button onClick={saveTrainer}>{editId ? "Update" : "Add"} Trainer</button>
          {editId && <button onClick={() => { setEditId(null); setName(""); setSpecialization(""); }}>Cancel</button>}
        </div>
      )}

      <ul>
        {trainers.map((t) => (
          <li key={t.id}>
            {t.name} - {t.specialization}
            {role === "admin" && (
              <>
                <button onClick={() => editTrainer(t)}>Edit</button>
                <button onClick={() => deleteTrainer(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Trainers;
