// src/services/userAPI.js
import apiClient from "./api";

export const userAPI = {
  // Get user by username
  getUserByUsername: (username) => apiClient.get(`/users/username/${username}`),

  // Get current user profile
  getCurrentUser: () => apiClient.get("/users/current-user"),

  // Update user profile
  updateProfile: (data) => apiClient.patch("/users/update-account", data),

  // Update avatar
  updateAvatar: (formData) =>
    apiClient.patch("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Update cover image
  updateCoverImage: (formData) =>
    apiClient.patch("/users/cover-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
