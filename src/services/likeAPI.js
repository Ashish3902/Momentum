// src/services/likeAPI.js - Correct API paths
import apiClient from "./api";

export const likeAPI = {
  // Toggle video like - matches your backend route
  toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),

  // Toggle comment like - matches your backend route
  toggleCommentLike: (commentId) =>
    apiClient.post(`/likes/toggle/c/${commentId}`),

  // Get liked videos
  getLikedVideos: () => apiClient.get("/likes/videos"),
};
