import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  listBusinessReviews,
  listMyReviews,
  respondToReview,
} from "./services";
import type {
  MyReview,
  Review,
  ReviewCreateInput,
  ReviewResponseCreateInput,
} from "./types";

export function useBusinessReviews(businessId: number | undefined) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "business", businessId],
    queryFn: () => listBusinessReviews(businessId as number),
    enabled: typeof businessId === "number" && !Number.isNaN(businessId),
  });
}

export function usePublishReview(businessId: number) {
  const qc = useQueryClient();
  return useMutation<Review, Error, ReviewCreateInput>({
    mutationFn: (payload) => createReview(businessId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", "business", businessId] });
      qc.invalidateQueries({ queryKey: ["businesses", "public", "detail", businessId] });
      qc.invalidateQueries({ queryKey: ["users", "me", "reviews"] });
    },
  });
}

export function useRespondToReview() {
  const qc = useQueryClient();
  return useMutation<Review, Error, { reviewId: number; payload: ReviewResponseCreateInput }>({
    mutationFn: ({ reviewId, payload }) => respondToReview(reviewId, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["reviews", "business", data.business_id] });
      qc.invalidateQueries({ queryKey: ["metrics", "business", "me"] });
    },
  });
}

export function useMyReviews(enabled = true) {
  return useQuery<MyReview[]>({
    queryKey: ["users", "me", "reviews"],
    queryFn: listMyReviews,
    enabled,
  });
}
