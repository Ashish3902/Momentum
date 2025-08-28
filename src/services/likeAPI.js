// src/services/likeAPI.js - Only handles toggling
import apiClient from "./api";

export const likeAPI = {
  // Toggle video like
  toggleVideoLike: (videoId) => {
    return apiClient.post(`/likes/toggle/v/${videoId}`);
  },

  // Toggle comment like
  toggleCommentLike: (commentId) => {
    return apiClient.post(`/likes/toggle/c/${commentId}`);
  },

  // getLikedVideos removed - now in libraryAPI
};
