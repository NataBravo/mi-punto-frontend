import { atomWithStorage } from "jotai/utils";

/**
 * Última ubicación elegida por el usuario final.
 * - city: ciudad seleccionada manualmente (si la hay)
 * - lat/lng: coordenadas del navegador (si autorizó geolocalización)
 *
 * Persistido en localStorage para no preguntar dos veces.
 */
export type LocationSource = "gps" | "city";

export interface SelectedLocation {
  city: string | null;
  lat: number | null;
  lng: number | null;
  /** Origen de las coordenadas: "gps" cuando vienen del navegador, "city" cuando son el centro de una ciudad. */
  source?: LocationSource | null;
}

export const initialSelectedLocation: SelectedLocation = {
  city: null,
  lat: null,
  lng: null,
  source: null,
};

export const selectedLocationAtom = atomWithStorage<SelectedLocation>(
  "mi_punto_location",
  initialSelectedLocation,
);
