import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const location = useLocation();
  const token = sessionStorage.getItem("tkn");
  const userType = sessionStorage.getItem("userType");

  // If no token, redirect to login
  if (!token) {
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }
  console.log("userType !== requiredRole:", userType !== requiredRole);
  // If role is required but doesn't match, redirect to home
  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
