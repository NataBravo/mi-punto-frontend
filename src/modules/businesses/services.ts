import { api } from "@/lib/api";

import type {
  BusinessCreateInput,
  BusinessDetail,
  BusinessLocationInput,
  BusinessOwnerRow,
  BusinessUpdateInput,
  CatalogParams,
  CategoryOut,
  MyBusiness,
  NearbyParams,
  PublicBusinessDetail,
  PublicBusinessSummary,
  ToggleResult,
} from "./types";

export interface OwnerListParams {
  q?: string;
  status?: "active" | "inactive";
}

export function listBusinessesForOwner(params: OwnerListParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set("q", params.q);
  if (params.status) searchParams.set("status", params.status);
  const query = searchParams.toString();
  return api<BusinessOwnerRow[]>(`/businesses/admin${query ? `?${query}` : ""}`);
}

export function getBusinessForOwner(id: number) {
  return api<BusinessDetail>(`/businesses/${id}/admin`);
}

export function toggleBusiness(id: number) {
  return api<ToggleResult>(`/businesses/${id}/toggle`, { method: "PATCH" });
}

// Admin de negocio (su propio negocio)
export function getMyBusiness() {
  return api<MyBusiness | null>("/businesses/me");
}

export function createMyBusiness(payload: BusinessCreateInput) {
  return api<MyBusiness>("/businesses/me", { method: "POST", body: payload });
}

export function updateMyBusiness(payload: BusinessUpdateInput) {
  return api<MyBusiness>("/businesses/me", { method: "PUT", body: payload });
}

export function updateMyBusinessLocation(payload: BusinessLocationInput) {
  return api<MyBusiness>("/businesses/me/location", { method: "PUT", body: payload });
}

// Catálogos auxiliares
export function listCategories() {
  return api<CategoryOut[]>("/categories", { anonymous: true });
}

export function listCities() {
  return api<string[]>("/cities", { anonymous: true });
}

// Público: catálogo, mapa, perfil
export function listPublicBusinesses(params: CatalogParams = {}) {
  const sp = new URLSearchParams();
  if (params.city) sp.set("city", params.city);
  if (params.category_id) sp.set("category_id", String(params.category_id));
  if (params.q) sp.set("q", params.q);
  if (params.page) sp.set("page", String(params.page));
  if (params.page_size) sp.set("page_size", String(params.page_size));
  const query = sp.toString();
  return api<PublicBusinessSummary[]>(`/businesses${query ? `?${query}` : ""}`);
}

export function listNearbyBusinesses(params: NearbyParams) {
  const sp = new URLSearchParams();
  sp.set("lat", String(params.lat));
  sp.set("lng", String(params.lng));
  if (params.radius_km !== undefined) sp.set("radius_km", String(params.radius_km));
  return api<PublicBusinessSummary[]>(`/businesses/nearby?${sp.toString()}`);
}

export function getPublicBusiness(id: number) {
  return api<PublicBusinessDetail>(`/businesses/${id}`);
}
