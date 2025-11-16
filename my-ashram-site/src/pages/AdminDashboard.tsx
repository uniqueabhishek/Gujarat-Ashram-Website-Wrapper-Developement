import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>You're logged in as <strong>admin</strong>.</p>

      <button onClick={handleLogout} style={{ padding: 8 }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
