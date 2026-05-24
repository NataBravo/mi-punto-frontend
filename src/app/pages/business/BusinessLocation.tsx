import { ExternalLink, Loader2, MapPin, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { MapDraggable } from "@/app/components/Map";
import { buildGoogleMapsUrl } from "@/lib/geo";
import { useMyBusiness, useUpdateMyBusinessLocation } from "@/modules/businesses/hooks";

const DEFAULT_CENTER: [number, number] = [4.6533, -74.0836]; // Bogotá

export default function BusinessLocation() {
  const myBusiness = useMyBusiness();
  const update = useUpdateMyBusinessLocation();

  const [position, setPosition] = useState<[number, number]>(DEFAULT_CENTER);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const b = myBusiness.data;
    if (b) {
      if (b.lat !== null && b.lng !== null) {
        setPosition([b.lat, b.lng]);
      }
      setAddress(b.address ?? "");
    }
  }, [myBusiness.data]);

  if (myBusiness.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando ubicación…" />
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
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-3" />
        <h2 className="font-semibold text-lg">Aún no tienes un negocio</h2>
        <p className="text-gray-600 mt-1">
          Crea primero el perfil de tu negocio en "Editar perfil".
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        lat: position[0],
        lng: position[1],
        address: address || undefined,
      });
      toast.success("Ubicación actualizada");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos actualizar la ubicación";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ubicación del negocio</h1>
        <p className="text-gray-600">
          Arrastra el marcador en el mapa o ajusta lat/lng manualmente para fijar la ubicación que verán tus clientes.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Calle 72 #10-34"
          />
        </div>

        <MapDraggable
          height="420px"
          zoom={15}
          markerPosition={position}
          onChange={({ lat, lng }) => setPosition([lat, lng])}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitud</label>
            <input
              type="number"
              step="0.0001"
              value={position[0]}
              onChange={(e) => setPosition([Number(e.target.value), position[1]])}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitud</label>
            <input
              type="number"
              step="0.0001"
              value={position[1]}
              onChange={(e) => setPosition([position[0], Number(e.target.value)])}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={update.isPending}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
          >
            {update.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar ubicación
          </button>

          <a
            href={buildGoogleMapsUrl(position[0], position[1])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
            title="Verifica que las coordenadas abran el punto correcto en Google Maps"
          >
            <ExternalLink className="w-4 h-4" />
            Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
