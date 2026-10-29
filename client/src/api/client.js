// The only place that calls fetch(). Adds the base URL, the login token and error handling.

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "folio_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { method = "GET", body, params } = {}) {
  const query = new URLSearchParams(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ""),
  ).toString();

  const token = tokenStore.get();
  const response = await fetch(`${BASE_URL}${path}${query ? `?${query}` : ""}`, {
    method,
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || "Request failed", response.status);
  return data;
}
