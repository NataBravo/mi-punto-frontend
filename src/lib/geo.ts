export interface Coordinates {
  lat: number;
  lng: number;
}

export class GeolocationUnavailableError extends Error {
  constructor() {
    super("Tu navegador no soporta geolocalización");
    this.name = "GeolocationUnavailableError";
  }
}

export class GeolocationDeniedError extends Error {
  constructor(message?: string) {
    super(message || "Permiso de geolocalización denegado");
    this.name = "GeolocationDeniedError";
  }
}

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 60000,
};

export function getCurrentPosition(options: PositionOptions = DEFAULT_OPTIONS): Promise<Coordinates> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.reject(new GeolocationUnavailableError());
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new GeolocationDeniedError(err.message));
        } else {
          reject(new Error(err.message || "Error obteniendo la ubicación"));
        }
      },
      options,
    );
  });
}

/** Distancia Haversine en km entre dos puntos. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const x = sinDLat * sinDLat + sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

/** Coordenadas centrales por ciudad (fallback cuando el usuario solo elige ciudad). */
export const CITY_COORDS: Record<string, Coordinates> = {
  Bogotá: { lat: 4.6533, lng: -74.0836 },
  Medellín: { lat: 6.2476, lng: -75.5658 },
  Cali: { lat: 3.4516, lng: -76.5320 },
  Barranquilla: { lat: 10.9685, lng: -74.7813 },
  Cartagena: { lat: 10.3997, lng: -75.5144 },
  Bucaramanga: { lat: 7.1193, lng: -73.1227 },
  Pereira: { lat: 4.8133, lng: -75.6961 },
  Manizales: { lat: 5.0703, lng: -75.5138 },
};
