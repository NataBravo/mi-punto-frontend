import { LogOut, MapPin, User } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useCurrentUser, useLogout } from "@/modules/auth/hooks";

interface NavbarProps {
  userType?: "user" | "business" | "owner";
}

const ROLE_LABEL: Record<NonNullable<NavbarProps["userType"]>, string> = {
  user: "Usuario",
  business: "Administrador",
  owner: "Dueño",
};

export function Navbar({ userType }: NavbarProps) {
  const { user } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl">Mi Punto</span>
        </Link>

        <div className="flex items-center gap-6">
          {!userType && (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Registrarse
              </Link>
            </>
          )}

          {userType && (
            <div className="flex items-center gap-4">
              {userType === "user" && (
                <>
                  <Link
                    to="/user/catalog"
                    className="text-sm text-gray-700 hover:text-blue-600"
                  >
                    Catálogo
                  </Link>
                  <Link
                    to="/user/map"
                    className="text-sm text-gray-700 hover:text-blue-600"
                  >
                    Mapa
                  </Link>
                </>
              )}
              <Link
                to={userType === "user" ? "/user/profile" : "#"}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                title={userType === "user" ? "Mi perfil" : undefined}
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{user?.full_name ?? ROLE_LABEL[userType]}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
