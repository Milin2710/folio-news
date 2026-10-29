import { request } from "./client.js";

export const signup = (body) => request("/auth/signup", { method: "POST", body });
export const login = (body) => request("/auth/login", { method: "POST", body });
export const getCurrentUser = () => request("/auth/me");
