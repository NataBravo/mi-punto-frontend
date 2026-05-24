import { api } from "@/lib/api";

import type { MediaOut, MyBusiness } from "@/modules/businesses/types";

export function uploadMyBusinessImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<MediaOut>("/uploads-api/business/me", { method: "POST", body: fd });
}

export function listMyBusinessMedia() {
  return api<MediaOut[]>("/uploads-api/business/me");
}

export function setPrimaryMedia(mediaId: number) {
  return api<MediaOut>(`/uploads-api/media/${mediaId}/primary`, { method: "PATCH" });
}

export function deleteMedia(mediaId: number) {
  return api<void>(`/uploads-api/media/${mediaId}`, { method: "DELETE" });
}

export function uploadMyBusinessLogo(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api<MyBusiness>("/uploads-api/business/me/logo", { method: "POST", body: fd });
}

export function deleteMyBusinessLogo() {
  return api<MyBusiness>("/uploads-api/business/me/logo", { method: "DELETE" });
}
