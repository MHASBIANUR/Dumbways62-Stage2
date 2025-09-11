import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
