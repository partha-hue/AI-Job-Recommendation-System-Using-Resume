import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import type { UserRole } from "../types";

export function ProtectedRoute({ children, role }: { children: JSX.Element; role?: UserRole }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="dashboard-view">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={user.role === "recruiter" ? "/recruiter" : "/candidate"} replace />;
  }
  return children;
}
