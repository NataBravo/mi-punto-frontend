import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { User } from "./types";

export const tokenAtom = atomWithStorage<string | null>("mi_punto_token", null);

const initialUser: User | null = null;
export const currentUserAtom = atom(initialUser);

export const isAuthenticatedAtom = atom((get) => Boolean(get(tokenAtom)));
