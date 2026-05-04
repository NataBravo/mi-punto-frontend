import { Link } from "react-router";
import { ShieldAlert } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Acceso denegado</h1>
        <p className="text-gray-600 mt-2">
          Tu rol no tiene permisos para acceder a esta sección.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
