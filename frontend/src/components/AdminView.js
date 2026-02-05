import Trainers from "./Trainers";
import Attendance from "./Attendance";
import Payments from "./Payments";
import Charts from "./Charts";

function AdminView() {
  return (
    <div className="admin-view">
      <h3>Admin Panel</h3>
      <div className="grid">
        <Trainers />
        <Attendance />
        <Payments />
        <Charts />
      </div>
    </div>
  );
}

export default AdminView;
