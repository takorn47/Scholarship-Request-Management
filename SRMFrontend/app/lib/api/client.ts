import axios from "axios";
import { useAuthStore } from "../stores/auth-store";

declare module "axios" {
  export interface AxiosRequestConfig {
    // Opt out of the global 401 -> redirect interceptor below, for callers
    // that already handle auth failures themselves.
    skipAuthRedirect?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://localhost:7227",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const CSRF_SAFE_METHODS = new Set(["get", "head", "options"]);

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

apiClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (method && !CSRF_SAFE_METHODS.has(method)) {
    const csrfToken = readCookie("csrfToken");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }
  return config;
});

// Requests that already handle 401s themselves (login, and the admin
// layout's own getMe() check) opt out via `skipAuthRedirect` to avoid a
// double redirect.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      useAuthStore.getState().logout();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);
