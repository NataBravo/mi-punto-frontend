import {
  Edit,
  Eye,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useMyBusiness } from "@/modules/businesses/hooks";
import { useMyBusinessMetrics } from "@/modules/metrics/hooks";

export default function BusinessDashboard() {
  const myBusiness = useMyBusiness();
  const metrics = useMyBusinessMetrics();

  if (myBusiness.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando dashboard…" />
      </div>
    );
  }

  if (myBusiness.isError) {
    return (
      <ErrorState title="No pudimos cargar tu negocio" onRetry={() => myBusiness.refetch()} />
    );
  }

  if (!myBusiness.data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-2xl mx-auto">
        <Edit className="w-10 h-10 text-blue-600 mx-auto mb-3" />
        <h2 className="font-semibold text-xl mb-2">Aún no creaste tu negocio</h2>
        <p className="text-gray-600 mb-4">
          Crea el perfil para empezar a aparecer en el catálogo de Mi Punto.
        </p>
        <Link
          to="/business/edit-profile"
          className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          Crear perfil del negocio
        </Link>
      </div>
    );
  }

  const business = myBusiness.data;
  const m = metrics.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{business.name}</h1>
        <p className="text-gray-600">
          {business.category.name} · {business.city}
          {!business.is_active && (
            <span className="ml-3 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
              Inactivo
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<Eye className="w-6 h-6 text-blue-600" />} bg="bg-blue-100" value={m?.profile_views ?? 0} label="Visitas al perfil" loading={metrics.isLoading} />
        <Stat icon={<Star className="w-6 h-6 text-yellow-600" />} bg="bg-yellow-100" value={m?.average_rating ?? 0} label="Calificación promedio" loading={metrics.isLoading} />
        <Stat icon={<MessageSquare className="w-6 h-6 text-green-600" />} bg="bg-green-100" value={m?.total_reviews ?? 0} label="Reseñas totales" loading={metrics.isLoading} />
        <Stat icon={<TrendingUp className="w-6 h-6 text-purple-600" />} bg="bg-purple-100" value={`${m?.response_rate ?? 0}%`} label="Tasa de respuesta" loading={metrics.isLoading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink to="/business/edit-profile" icon={<Edit className="w-5 h-5" />} label="Editar perfil" />
            <QuickLink to="/business/location" icon={<MapPin className="w-5 h-5" />} label="Ubicación" />
            <QuickLink to="/business/gallery" icon={<ImageIcon className="w-5 h-5" />} label="Galería" />
            <QuickLink to="/business/reviews" icon={<MessageSquare className="w-5 h-5" />} label="Reseñas" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Reseñas recientes</h2>
            {m?.pending_responses ? (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                {m.pending_responses} sin responder
              </span>
            ) : null}
          </div>

          {metrics.isLoading ? (
            <LoadingSpinner />
          ) : m?.recent_reviews.length ? (
            <div className="space-y-4">
              {m.recent_reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{r.user_full_name}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {r.has_response ? "Respondida" : "Pendiente"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aún no hay reseñas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  icon: React.ReactNode;
  bg: string;
  value: number | string;
  label: string;
  loading?: boolean;
}

function Stat({ icon, bg, value, label, loading }: StatProps) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center mb-3`}>
        {icon}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1" />
      ) : (
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
      )}
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function QuickLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-colors"
    >
      <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </span>
      <span className="font-medium text-sm text-gray-900">{label}</span>
    </Link>
  );
}
