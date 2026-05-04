import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  type OwnerListParams,
  createMyBusiness,
  getBusinessForOwner,
  getMyBusiness,
  getPublicBusiness,
  listBusinessesForOwner,
  listCategories,
  listCities,
  listNearbyBusinesses,
  listPublicBusinesses,
  toggleBusiness,
  updateMyBusiness,
  updateMyBusinessLocation,
} from "./services";
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

// Owner global
export function useOwnerBusinesses(params: OwnerListParams) {
  return useQuery<BusinessOwnerRow[]>({
    queryKey: ["businesses", "owner", params],
    queryFn: () => listBusinessesForOwner(params),
  });
}

export function useOwnerBusinessDetail(id: number | undefined) {
  return useQuery<BusinessDetail>({
    queryKey: ["businesses", "owner", "detail", id],
    queryFn: () => getBusinessForOwner(id as number),
    enabled: typeof id === "number" && !Number.isNaN(id),
  });
}

export function useToggleBusiness() {
  const qc = useQueryClient();
  return useMutation<ToggleResult, Error, number>({
    mutationFn: (id) => toggleBusiness(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["businesses", "owner"] });
      qc.invalidateQueries({ queryKey: ["businesses", "owner", "detail", data.id] });
      qc.invalidateQueries({ queryKey: ["metrics", "owner"] });
    },
  });
}

// Admin de negocio (su propio negocio)
export function useMyBusiness() {
  return useQuery<MyBusiness | null>({
    queryKey: ["businesses", "me"],
    queryFn: getMyBusiness,
  });
}

export function useCreateMyBusiness() {
  const qc = useQueryClient();
  return useMutation<MyBusiness, Error, BusinessCreateInput>({
    mutationFn: createMyBusiness,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businesses", "me"] });
    },
  });
}

export function useUpdateMyBusiness() {
  const qc = useQueryClient();
  return useMutation<MyBusiness, Error, BusinessUpdateInput>({
    mutationFn: updateMyBusiness,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businesses", "me"] });
      qc.invalidateQueries({ queryKey: ["metrics", "business", "me"] });
    },
  });
}

export function useUpdateMyBusinessLocation() {
  const qc = useQueryClient();
  return useMutation<MyBusiness, Error, BusinessLocationInput>({
    mutationFn: updateMyBusinessLocation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["businesses", "me"] });
    },
  });
}

// Catálogos
export function useCategories() {
  return useQuery<CategoryOut[]>({
    queryKey: ["categories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCities() {
  return useQuery<string[]>({
    queryKey: ["cities"],
    queryFn: listCities,
    staleTime: 5 * 60 * 1000,
  });
}

// Público
export function usePublicBusinesses(params: CatalogParams) {
  return useQuery<PublicBusinessSummary[]>({
    queryKey: ["businesses", "public", params],
    queryFn: () => listPublicBusinesses(params),
  });
}

export function useNearbyBusinesses(params: NearbyParams | null) {
  return useQuery<PublicBusinessSummary[]>({
    queryKey: ["businesses", "nearby", params],
    queryFn: () => listNearbyBusinesses(params as NearbyParams),
    enabled: params !== null && Number.isFinite(params.lat) && Number.isFinite(params.lng),
  });
}

export function usePublicBusinessDetail(id: number | undefined) {
  return useQuery<PublicBusinessDetail>({
    queryKey: ["businesses", "public", "detail", id],
    queryFn: () => getPublicBusiness(id as number),
    enabled: typeof id === "number" && !Number.isNaN(id),
    // Cada vez que se entra al perfil, queremos que registre visita.
    staleTime: 0,
    refetchOnMount: "always",
  });
}
