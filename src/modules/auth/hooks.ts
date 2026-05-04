import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";

import { currentUserAtom, tokenAtom } from "./atoms";
import { loginRequest, meRequest, registerRequest } from "./services";
import type { LoginInput, RegisterInput, TokenResponse, User } from "./types";

export function useLogin() {
  const setToken = useSetAtom(tokenAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const qc = useQueryClient();

  return useMutation<TokenResponse, Error, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setToken(data.access_token);
      setCurrentUser(data.user);
      qc.invalidateQueries();
    },
  });
}

export function useRegister() {
  return useMutation<User, Error, RegisterInput>({
    mutationFn: registerRequest,
  });
}

export function useLogout() {
  const setToken = useSetAtom(tokenAtom);
  const setCurrentUser = useSetAtom(currentUserAtom);
  const qc = useQueryClient();

  return () => {
    setToken(null);
    setCurrentUser(null);
    qc.clear();
  };
}

export function useCurrentUser() {
  const [token] = useAtom(tokenAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const query = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await meRequest();
      setCurrentUser(user);
      return user;
    },
    enabled: Boolean(token) && !currentUser,
    retry: false,
  });

  return {
    user: currentUser ?? query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
