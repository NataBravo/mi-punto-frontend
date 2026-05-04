import { api } from "@/lib/api";

import type { LoginInput, RegisterInput, TokenResponse, User } from "./types";

export function loginRequest(payload: LoginInput) {
  return api<TokenResponse>("/auth/login", { method: "POST", body: payload, anonymous: true });
}

export function registerRequest(payload: RegisterInput) {
  return api<User>("/auth/register", { method: "POST", body: payload, anonymous: true });
}

export function meRequest() {
  return api<User>("/auth/me");
}
