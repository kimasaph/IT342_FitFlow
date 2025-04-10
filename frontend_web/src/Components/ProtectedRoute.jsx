import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    // Redirect to login if no token or user data
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.error(`Access denied for role: ${user.role}`);
    // Redirect to login if the user's role is not allowed
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;