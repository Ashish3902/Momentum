import apiClient from "./api";

// In commentAPI.js - Verify endpoints match your backend
export const commentAPI = {
  getVideoComments: (videoId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/comments/${videoId}?${queryParams.toString()}`);
  },

  addComment: (videoId, content) =>
    apiClient.post(`/comments/${videoId}`, { content }),

  updateComment: (commentId, content) =>
    apiClient.patch(`/comments/c/${commentId}`, { content }),

  deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),
};
