import { ApiError } from "./apiErrors";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!response.ok) {
    const details = await response.json().catch(() => null);
    throw new ApiError(details?.message ?? "Request failed", response.status, details);
  }
  return response.status === 204 ? (undefined as T) : response.json();
}
