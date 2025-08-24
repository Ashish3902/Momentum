import apiClient from "./api";

export const likeAPI = {
  // Toggle video like
  toggleVideoLike: (videoId) => apiClient.post(`/likes/toggle/v/${videoId}`),

  // Toggle comment like
  toggleCommentLike: (commentId) =>
    apiClient.post(`/likes/toggle/c/${commentId}`),

  // Get liked videos
  getLikedVideos: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/likes/videos?${queryParams.toString()}`);
  },
};
