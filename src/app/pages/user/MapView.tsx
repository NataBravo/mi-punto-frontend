import { useAtom } from "jotai";
import { List, Loader2, Navigation, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { EmptyState } from "@/app/components/EmptyState";
import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { MapReadOnly, type MapMarker } from "@/app/components/Map";
import { CITY_COORDS, getCurrentPosition } from "@/lib/geo";
import { useNearbyBusinesses } from "@/modules/businesses/hooks";
import { selectedLocationAtom } from "@/modules/location/atoms";

const DEFAULT_CENTER: [number, number] = [4.6533, -74.0836]; // Bogotá
const RADIUS_OPTIONS = [1, 2, 5, 10, 25];

export default function MapView() {
  const [location, setLocation] = useAtom(selectedLocationAtom);
  const [radiusKm, setRadiusKm] = useState(5);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  const baseCenter: [number, number] = useMemo(() => {
    if (location.lat !== null && location.lng !== null) return [location.lat, location.lng];
    if (location.city && CITY_COORDS[location.city]) {
      const c = CITY_COORDS[location.city];
      return [c.lat, c.lng];
    }
    return DEFAULT_CENTER;
  }, [location]);

  const nearby = useNearbyBusinesses(
    location.lat !== null && location.lng !== null
      ? { lat: location.lat, lng: location.lng, radius_km: radiusKm }
      : location.city && CITY_COORDS[location.city]
      ? { ...CITY_COORDS[location.city], radius_km: radiusKm }
      : null,
  );

  const businesses = nearby.data ?? [];

  const markers: MapMarker[] = businesses
    .filter((b) => b.lat !== null && b.lng !== null)
    .map((b) => ({
      id: b.id,
      lat: b.lat as number,
      lng: b.lng as number,
      popup: (
        <div className="min-w-[180px]">
          <p className="font-semibold text-gray-900">{b.name}</p>
          <p className="text-xs text-gray-600 mb-1">{b.category.name}</p>
          {b.distance_km !== null && (
            <p className="text-xs text-blue-600 mb-2">{b.distance_km?.toFixed(2)} km</p>
          )}
          <Link
            to={`/user/business/${b.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Ver perfil →
          </Link>
        </div>
      ),
    }));

  const handleUseGps = async () => {
    setLocating(true);
    try {
      const coords = await getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      setLocation({
        city: location.city,
        lat: coords.lat,
        lng: coords.lng,
        source: "gps",
      });
      toast.success("Ubicación actualizada");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "No pudimos obtener tu ubicación";
      toast.error(msg);
    } finally {
      setLocating(false);
    }
  };

  const center: [number, number] = selectedId
    ? (() => {
        const sel = businesses.find((b) => b.id === selectedId);
        return sel && sel.lat !== null && sel.lng !== null
          ? [sel.lat, sel.lng]
          : baseCenter;
      })()
    : baseCenter;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4">
      <div className="lg:w-96 bg-white rounded-lg shadow-sm p-4 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Negocios cercanos</h2>
          <Link to="/user/catalog" className="text-blue-600 hover:text-blue-700" title="Ver lista">
            <List className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Radio
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {RADIUS_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r} km
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUseGps}
            disabled={locating}
            className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {location.lat ? "Actualizar ubicación" : "Usar mi ubicación"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {nearby.isLoading && <LoadingSpinner />}
          {nearby.isError && (
            <ErrorState title="No pudimos cargar negocios" onRetry={() => nearby.refetch()} />
          )}
          {!nearby.isLoading && !nearby.isError && businesses.length === 0 && (
            <EmptyState title="Sin resultados" message="Probá un radio mayor o cambia tu ubicación." />
          )}
          {businesses.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                selectedId === b.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm">{b.name}</h3>
                <div className="flex items-center gap-0.5 text-yellow-500 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs">
                    {b.review_count > 0 ? b.average_rating.toFixed(1) : "—"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600">{b.category.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-blue-600">
                  {b.distance_km !== null ? `${b.distance_km?.toFixed(2)} km` : "—"}
                </span>
                <Link
                  to={`/user/business/${b.id}`}
                  className="text-xs text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver perfil
                </Link>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative min-h-[400px]">
        <MapReadOnly
          center={center}
          zoom={location.lat ? 14 : 12}
          markers={markers}
          onMarkerClick={(id) => setSelectedId(typeof id === "number" ? id : Number(id))}
          selectedId={selectedId}
          height="100%"
          userPosition={
            location.source === "gps" && location.lat !== null && location.lng !== null
              ? [location.lat, location.lng]
              : undefined
          }
        />
      </div>
    </div>
  );
}
