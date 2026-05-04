import L, { type LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { ensureLeafletIconsConfigured } from "@/lib/leaflet";

ensureLeafletIconsConfigured();

const OSM_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  label?: string;
  popup?: React.ReactNode;
}

interface BaseMapProps {
  className?: string;
  height?: string;
  zoom?: number;
}

export interface ReadOnlyMapProps extends BaseMapProps {
  center: [number, number];
  markers?: MapMarker[];
  selectedId?: string | number | null;
  onMarkerClick?: (id: string | number) => void;
  /** Si se provee, dibuja un punto azul tipo "tú estás aquí" en esa coordenada. */
  userPosition?: [number, number];
}

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: '<span class="user-location-pulse"></span><span class="user-location-dot"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export interface DraggableMapProps extends BaseMapProps {
  markerPosition: [number, number];
  onChange: (next: { lat: number; lng: number }) => void;
}

function FlyTo({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.4 });
  }, [center, map]);
  return null;
}

const containerStyle = { height: "100%", width: "100%", borderRadius: "0.75rem" } as const;

/** Mapa de solo lectura con N marcadores y opcionalmente la posición del usuario. */
export function MapReadOnly({
  className,
  height = "400px",
  zoom = 14,
  center,
  markers,
  onMarkerClick,
  userPosition,
}: ReadOnlyMapProps) {
  return (
    <div className={className} style={{ height, width: "100%" }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={containerStyle}>
        <TileLayer attribution={OSM_ATTR} url={OSM_TILES} />
        {(markers ?? []).map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            eventHandlers={{ click: () => onMarkerClick?.(m.id) }}
          >
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ))}
        {userPosition && (
          <Marker position={userPosition} icon={userLocationIcon} interactive={false}>
            <Popup>Tu ubicación actual</Popup>
          </Marker>
        )}
        <FlyTo center={center} />
      </MapContainer>
    </div>
  );
}

/** Mapa con un único marcador draggable; informa lat/lng al cambiar. */
export function MapDraggable({
  className,
  height = "400px",
  zoom = 15,
  markerPosition,
  onChange,
}: DraggableMapProps) {
  return (
    <div className={className} style={{ height, width: "100%" }}>
      <MapContainer center={markerPosition} zoom={zoom} scrollWheelZoom style={containerStyle}>
        <TileLayer attribution={OSM_ATTR} url={OSM_TILES} />
        <DraggableMarker position={markerPosition} onChange={onChange} />
        <FlyTo center={markerPosition} />
      </MapContainer>
    </div>
  );
}

interface DraggableMarkerProps {
  position: [number, number];
  onChange: (next: { lat: number; lng: number }) => void;
}

function DraggableMarker({ position, onChange }: DraggableMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  return (
    <Marker
      draggable
      position={position}
      ref={(instance) => {
        markerRef.current = instance;
      }}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (!marker) return;
          const { lat, lng } = marker.getLatLng();
          onChange({ lat, lng });
        },
      }}
    />
  );
}
