import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../utils/authUtils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const authenticated = isAuthenticated();
  const userIsAdmin = isAdmin();

  // Si requiere estar autenticado y no lo está
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  // Si requiere ser admin y no lo es
  if (requireAdmin && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
