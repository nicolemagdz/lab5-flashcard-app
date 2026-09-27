import axios from "axios";
import type { ApiResponse } from "../../../shared/contracts";
import { useAuthStore } from "../store/authStore";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function unwrap<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const { data: envelope } = await promise;

  if (!envelope.success) {
    throw new Error(
      envelope.error?.message ?? "Unknown API error"
    );
  }

  if (envelope.data === undefined) {
    throw new Error("Response did not contain data");
  }

  return envelope.data;
}