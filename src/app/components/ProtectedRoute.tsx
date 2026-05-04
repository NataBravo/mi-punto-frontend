import { useAtomValue } from "jotai";
import { Navigate, Outlet, useLocation } from "react-router";

import { tokenAtom } from "@/modules/auth/atoms";
import { useCurrentUser } from "@/modules/auth/hooks";
import type { UserRole } from "@/modules/auth/types";

import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = useAtomValue(tokenAtom);
  const { user, isLoading, isError } = useCurrentUser();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner label="Verificando sesión…" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
