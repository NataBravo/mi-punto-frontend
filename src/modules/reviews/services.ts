import { api } from "@/lib/api";

import type {
  MyReview,
  Review,
  ReviewCreateInput,
  ReviewResponseCreateInput,
} from "./types";

export function listBusinessReviews(businessId: number, page = 1, pageSize = 50) {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("page_size", String(pageSize));
  return api<Review[]>(`/businesses/${businessId}/reviews?${sp.toString()}`);
}

export function createReview(businessId: number, payload: ReviewCreateInput) {
  return api<Review>(`/businesses/${businessId}/reviews`, {
    method: "POST",
    body: payload,
  });
}

export function respondToReview(reviewId: number, payload: ReviewResponseCreateInput) {
  return api<Review>(`/reviews/${reviewId}/response`, {
    method: "POST",
    body: payload,
  });
}

export function listMyReviews() {
  return api<MyReview[]>("/users/me/reviews");
}
