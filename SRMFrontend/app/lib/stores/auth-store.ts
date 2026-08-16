import { create } from "zustand";
import type { MeResponse } from "../api/auth";

interface AuthState {
  user: MeResponse | null;
  setUser: (user: MeResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
