// src/services/watchLaterAPI.js
import apiClient from "./api";

export const watchLaterAPI = {
  getWatchLater: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/users/watchlater?${queryParams.toString()}`);
  },

  addToWatchLater: (videoId) =>
    apiClient.post("/users/watchlater", { videoId }),

  removeFromWatchLater: (videoId) =>
    apiClient.delete(`/users/watchlater/${videoId}`),

  checkWatchLater: (videoId) =>
    apiClient.get(`/users/watchlater/check/${videoId}`),
};
