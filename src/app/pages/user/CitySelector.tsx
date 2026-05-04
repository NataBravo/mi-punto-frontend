import { useSetAtom } from "jotai";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import {
  CITY_COORDS,
  GeolocationDeniedError,
  GeolocationUnavailableError,
  getCurrentPosition,
} from "@/lib/geo";
import { useCities } from "@/modules/businesses/hooks";
import { selectedLocationAtom } from "@/modules/location/atoms";

export default function CitySelector() {
  const navigate = useNavigate();
  const setLocation = useSetAtom(selectedLocationAtom);
  const citiesQuery = useCities();

  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);

  const handleUseGps = async () => {
    setLocating(true);
    try {
      const coords = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      });
      // Si la ciudad ya está elegida, la conservamos como hint, si no, dejamos null.
      setLocation({
        city: city || null,
        lat: coords.lat,
        lng: coords.lng,
        source: "gps",
      });
      toast.success("Ubicación detectada");
      navigate("/user/map");
    } catch (error) {
      if (error instanceof GeolocationUnavailableError) {
        toast.error("Tu navegador no soporta geolocalización; elige una ciudad");
      } else if (error instanceof GeolocationDeniedError) {
        toast.error("Permiso denegado. Puedes elegir una ciudad manualmente.");
      } else {
        const msg = error instanceof Error ? error.message : "Error obteniendo la ubicación";
        toast.error(msg);
      }
    } finally {
      setLocating(false);
    }
  };

  const handleContinue = () => {
    if (!city) {
      toast.error("Selecciona una ciudad");
      return;
    }
    const fallback = CITY_COORDS[city] ?? null;
    setLocation({
      city,
      lat: fallback?.lat ?? null,
      lng: fallback?.lng ?? null,
      source: "city",
    });
    navigate("/user/catalog");
  };

  if (citiesQuery.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando ciudades…" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¿Dónde estás?</h1>
        <p className="text-gray-600">
          Elige una ciudad o usa tu ubicación actual para ver negocios cercanos.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <button
          onClick={handleUseGps}
          disabled={locating}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
          {locating ? "Localizando…" : "Usar mi ubicación actual"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o elige una ciudad</span>
          </div>
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar ciudad…</option>
          {citiesQuery.data?.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={handleContinue}
          disabled={!city}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
