import { ArrowLeft, Eye, Mail, MapPin, MessageSquare, Phone, Power, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { useOwnerBusinessDetail, useToggleBusiness } from "@/modules/businesses/hooks";

export default function BusinessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const businessId = id ? Number(id) : undefined;

  const detail = useOwnerBusinessDetail(businessId);
  const toggleMutation = useToggleBusiness();

  if (detail.isLoading || businessId === undefined) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando negocio…" />
      </div>
    );
  }

  if (detail.isError || !detail.data) {
    return (
      <ErrorState
        title="No pudimos cargar el negocio"
        onRetry={() => detail.refetch()}
      />
    );
  }

  const business = detail.data;

  const handleToggle = async () => {
    try {
      const result = await toggleMutation.mutateAsync(business.id);
      toast.success(
        `${business.name} ahora está ${result.is_active ? "activo" : "inactivo"}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos actualizar el estado";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/owner/businesses")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a la lista
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
          <p className="text-gray-600">{business.category.name}</p>
        </div>
        <button
          onClick={handleToggle}
          disabled={toggleMutation.isPending}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-60 ${
            business.is_active
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <Power className="w-5 h-5" />
          {business.is_active ? "Desactivar negocio" : "Activar negocio"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Stat icon={<Eye className="w-6 h-6 text-blue-600" />} bg="bg-blue-100" value={business.profile_views} label="Visitas al perfil" />
        <Stat icon={<Star className="w-6 h-6 text-yellow-600" />} bg="bg-yellow-100" value={business.average_rating} label="Calificación promedio" />
        <Stat icon={<MessageSquare className="w-6 h-6 text-green-600" />} bg="bg-green-100" value={business.review_count} label="Total de reseñas" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Información del negocio</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Estado</p>
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                  business.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {business.is_active ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Descripción</p>
              <p className="text-gray-900">{business.description || "Sin descripción"}</p>
            </div>

            <InfoRow icon={<MapPin className="w-5 h-5 text-gray-600 mt-0.5" />} label="Dirección" value={`${business.address}, ${business.city}`} />
            {business.phone && (
              <InfoRow icon={<Phone className="w-5 h-5 text-gray-600 mt-0.5" />} label="Teléfono" value={business.phone} />
            )}
            {business.email && (
              <InfoRow icon={<Mail className="w-5 h-5 text-gray-600 mt-0.5" />} label="Email" value={business.email} />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Administrador responsable</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Nombre</p>
                <p className="text-gray-900">{business.admin_full_name ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                <p className="text-gray-900">{business.admin_email ?? "—"}</p>
              </div>
            </div>
          </div>
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
}

function Stat({ icon, bg, value, label }: StatProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}
