import apiClient from "./api";

export const commentAPI = {
  // Get video comments
  getVideoComments: (videoId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/comments/${videoId}?${queryParams.toString()}`);
  },

  // Add comment
  addComment: (videoId, content) =>
    apiClient.post(`/comments/${videoId}`, { content }),

  // Update comment
  updateComment: (commentId, content) =>
    apiClient.patch(`/comments/c/${commentId}`, { content }),

  // Delete comment
  deleteComment: (commentId) => apiClient.delete(`/comments/c/${commentId}`),
};
