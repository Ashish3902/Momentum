import apiClient from "./api";

export const videoAPI = {
  // Get all videos with filters
  getAllVideos: (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/videos?${queryParams.toString()}`);
  },

  // Get trending videos
  getTrendingVideos: (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/videos/trending?${queryParams.toString()}`);
  },

  // Search videos
  // In videoAPI.js - Fix search endpoint
  searchVideos: (query, params = {}) => {
    const queryParams = new URLSearchParams({ q: query });

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/videos/search?${queryParams.toString()}`);
  },

  // Get single video
  getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),

  // Upload video
  uploadVideo: (formData, onUploadProgress) => {
    return apiClient.post("/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  // Update video
  updateVideo: (videoId, data) => {
    if (data instanceof FormData) {
      return apiClient.patch(`/videos/${videoId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return apiClient.patch(`/videos/${videoId}`, data);
  },

  // Delete video
  deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),

  // Toggle publish status
  togglePublishStatus: (videoId) =>
    apiClient.patch(`/videos/toggle/publish/${videoId}`),

  // Get video stats
  getVideoStats: (videoId) => apiClient.get(`/videos/stats/${videoId}`),

  // Get upload status
  getUploadStatus: (videoId) => apiClient.get(`/videos/status/${videoId}`),

  // Get categories
  getCategories: () => apiClient.get("/videos/categories"),

  // Get user videos
  getUserVideos: (userId, params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    return apiClient.get(`/videos/user/${userId}?${queryParams.toString()}`);
  },
};
