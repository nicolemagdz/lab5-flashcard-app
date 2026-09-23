// Minimal global client state: only the auth session lives here.
// Server data (decks, cards) is NOT duplicated into this store -- it
// stays in React Query's cache, fetched via the hooks in ./hooks.

import { create } from "zustand";
import type { UserDTO } from "@flashcard/shared";

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  setSession: (user: UserDTO, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  setSession: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },
  clearSession: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },
}));
