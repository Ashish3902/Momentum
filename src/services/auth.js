// src/services/auth.js
import apiClient from "./api";

export const registerUser = (data) => apiClient.post("/users/register", data);
export const loginUser = (data) => apiClient.post("/users/login", data);
export const logoutUser = () => apiClient.post("/users/logout");
export const getCurrentUser = () => apiClient.get("/users/me");
export const refreshToken = () => apiClient.post("/users/refresh-token");
export const updateProfile = (data) => apiClient.patch("/users/profile", data);
export const changePassword = (data) =>
  apiClient.patch("/users/password", data);
