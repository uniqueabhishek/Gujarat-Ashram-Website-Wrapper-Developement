import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authAPI } from "@/lib/api";

interface AdminGateProps {
  children: React.ReactNode;
}

const AdminGate: React.FC<AdminGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    authAPI.me()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminGate;
