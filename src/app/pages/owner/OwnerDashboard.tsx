import {
  Building2,
  MapPin,
  MessageSquare,
  PieChart,
  TrendingUp,
} from "lucide-react";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useOwnerMetrics } from "@/modules/metrics/hooks";

const CATEGORY_COLORS = [
  "bg-green-600",
  "bg-blue-600",
  "bg-yellow-600",
  "bg-purple-600",
  "bg-red-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-orange-600",
];

export default function OwnerDashboard() {
  const metrics = useOwnerMetrics();

  if (metrics.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando métricas globales…" />
      </div>
    );
  }

  if (metrics.isError || !metrics.data) {
    return (
      <ErrorState
        title="No pudimos cargar las métricas"
        message="Verifica que el backend esté corriendo."
        onRetry={() => metrics.refetch()}
      />
    );
  }

  const m = metrics.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Global</h1>
        <p className="text-gray-600">Métricas generales de la plataforma Mi Punto</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          bg="bg-blue-100"
          value={m.total_businesses}
          label="Total de negocios"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          bg="bg-green-100"
          value={m.active_businesses}
          label="Negocios activos"
        />
        <StatCard
          icon={<Building2 className="w-6 h-6 text-red-600" />}
          bg="bg-red-100"
          value={m.inactive_businesses}
          label="Negocios inactivos"
        />
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-yellow-600" />}
          bg="bg-yellow-100"
          value={m.total_reviews}
          label="Total de reseñas"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          bg="bg-purple-100"
          value={m.total_visits}
          label="Visitas totales"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Distribución por ciudad</h2>
          </div>

          {m.cities.length === 0 ? (
            <p className="text-sm text-gray-500">Sin negocios todavía.</p>
          ) : (
            <div className="space-y-4">
              {m.cities.map((item) => (
                <div key={item.city}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{item.city}</span>
                    <span className="text-sm text-gray-600">
                      {item.count} negocios ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Distribución por categoría</h2>
          </div>

          {m.categories.length === 0 ? (
            <p className="text-sm text-gray-500">Sin categorías con negocios.</p>
          ) : (
            <div className="space-y-4">
              {m.categories.map((item, index) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-sm text-gray-600">
                      {item.count} negocios ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} h-2 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  bg: string;
  value: number;
  label: string;
}

function StatCard({ icon, bg, value, label }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
