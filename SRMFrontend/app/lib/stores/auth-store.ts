import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MeResponse } from "../api/auth";

interface AuthState {
  token: string | null;
  expiresAt: number | null;
  user: MeResponse | null;
  setSession: (token: string, expiresInMinutes: number) => void;
  setUser: (user: MeResponse) => void;
  logout: () => void;
  isTokenValid: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      expiresAt: null,
      user: null,
      setSession: (token, expiresInMinutes) =>
        set({ token, expiresAt: Date.now() + expiresInMinutes * 60_000 }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, expiresAt: null, user: null }),
      isTokenValid: () => {
        const { token, expiresAt } = get();
        return !!token && !!expiresAt && Date.now() < expiresAt;
      },
    }),
    { name: "srm-admin-auth" },
  ),
);
