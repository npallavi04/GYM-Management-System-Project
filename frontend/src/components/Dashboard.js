import AdminView from "./AdminView";
import MemberView from "./MemberView";

function Dashboard({ role, username }) {
  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Top-right username */}
      <div style={{ position: "absolute", top: 10, right: 20, fontWeight: "bold" }}>
        {username}
      </div>

      <h2>Dashboard</h2>
      {role === "admin" ? <AdminView /> : <MemberView />}

      
    </div>
  );
}

export default Dashboard;
