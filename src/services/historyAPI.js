// src/services/historyAPI.js
import apiClient from "./api";

export const historyAPI = {
  getWatchHistory: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/users/history?${queryParams.toString()}`);
  },

  addToHistory: (videoId) => apiClient.post("/users/history", { videoId }),

  removeFromHistory: (videoId) => apiClient.delete(`/users/history/${videoId}`),

  clearHistory: () => apiClient.delete("/users/history"),
};
