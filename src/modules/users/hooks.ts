import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { currentUserAtom } from "@/modules/auth/atoms";
import type { User } from "@/modules/auth/types";

import { type UpdateMeInput, updateMe } from "./services";

export function useUpdateMe() {
  const qc = useQueryClient();
  const [, setCurrentUser] = useAtom(currentUserAtom);

  return useMutation<User, Error, UpdateMeInput>({
    mutationFn: updateMe,
    onSuccess: (user) => {
      setCurrentUser(user);
      qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
