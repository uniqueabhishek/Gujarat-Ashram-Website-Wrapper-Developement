import React from "react";
import { Navigate } from "react-router-dom";

interface AdminGateProps {
  children: React.ReactNode;
}

const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminGate;
