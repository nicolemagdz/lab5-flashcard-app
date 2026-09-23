// Single axios instance. Attaches the bearer token from the auth store
// and unwraps the shared ApiResponse<T> envelope, so callers just get T
// or a thrown Error.

import axios from "axios";
import type { ApiResponse } from "@flashcard/shared";
import { useAuthStore } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data: envelope } = await promise;
  if (!envelope.success) throw new Error(envelope.error.message);
  return envelope.data;
}
