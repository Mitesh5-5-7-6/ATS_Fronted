import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    if (user.role === "Admin") return <Navigate to="/admin" />;
    if (user.role === "Agent") return <Navigate to="/agent" />;
    if (user.role === "Vendor") return <Navigate to="/vendor" />;
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
