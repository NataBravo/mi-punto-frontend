import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { MediaOut } from "@/modules/businesses/types";

import {
  deleteMedia,
  listMyBusinessMedia,
  setPrimaryMedia,
  uploadMyBusinessImage,
} from "./services";

const myMediaKey = ["uploads", "business", "me"] as const;

function invalidateAfterMutation(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: myMediaKey });
  qc.invalidateQueries({ queryKey: ["businesses", "me"] });
}

export function useMyBusinessMedia() {
  return useQuery<MediaOut[]>({
    queryKey: myMediaKey,
    queryFn: listMyBusinessMedia,
  });
}

export function useUploadMyBusinessImage() {
  const qc = useQueryClient();
  return useMutation<MediaOut, Error, File>({
    mutationFn: uploadMyBusinessImage,
    onSuccess: () => invalidateAfterMutation(qc),
  });
}

export function useSetPrimaryMedia() {
  const qc = useQueryClient();
  return useMutation<MediaOut, Error, number>({
    mutationFn: setPrimaryMedia,
    onSuccess: () => invalidateAfterMutation(qc),
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteMedia,
    onSuccess: () => invalidateAfterMutation(qc),
  });
}
