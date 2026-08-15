import { apiClient } from "./client";

export interface LoginResponse {
  token: string;
  expiresInMinutes: number;
}

export interface MeResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/api/Auth/login", {
    username,
    password,
  });
  return res.data;
}

export async function getMe(): Promise<MeResponse> {
  const res = await apiClient.get<MeResponse>("/api/Auth/me");
  return res.data;
}
