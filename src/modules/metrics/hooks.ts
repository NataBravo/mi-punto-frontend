import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

import type { BusinessMetrics, OwnerMetrics } from "./types";

export function useOwnerMetrics() {
  return useQuery<OwnerMetrics>({
    queryKey: ["metrics", "owner"],
    queryFn: () => api<OwnerMetrics>("/metrics/owner"),
  });
}

export function useMyBusinessMetrics() {
  return useQuery<BusinessMetrics>({
    queryKey: ["metrics", "business", "me"],
    queryFn: () => api<BusinessMetrics>("/metrics/business/me"),
  });
}
