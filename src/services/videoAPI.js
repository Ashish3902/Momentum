// import apiClient from "./api";

// export const videoAPI = {
//   // Get all videos with filters
//   getAllVideos: (params = {}) => {
//     const queryParams = new URLSearchParams();

//     Object.keys(params).forEach((key) => {
//       if (params[key] !== undefined && params[key] !== "") {
//         queryParams.append(key, params[key]);
//       }
//     });

//     return apiClient.get(`/videos?${queryParams.toString()}`);
//   },

//   // Get trending videos
//   getTrendingVideos: (params = {}) => {
//     const queryParams = new URLSearchParams();

//     Object.keys(params).forEach((key) => {
//       if (params[key] !== undefined && params[key] !== "") {
//         queryParams.append(key, params[key]);
//       }
//     });

//     return apiClient.get(`/videos/trending?${queryParams.toString()}`);
//   },

//   // Search videos
//   // In videoAPI.js - Fix search endpoint
//   searchVideos: (query, params = {}) => {
//     const queryParams = new URLSearchParams({ q: query });

//     Object.keys(params).forEach((key) => {
//       if (params[key] !== undefined && params[key] !== "") {
//         queryParams.append(key, params[key]);
//       }
//     });

//     return apiClient.get(`/videos/search?${queryParams.toString()}`);
//   },

//   // Get single video
//   getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),

//   // Upload video
//   uploadVideo: (formData, onUploadProgress) => {
//     return apiClient.post("/videos", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress,
//     });
//   },

//   // Update video
//   updateVideo: (videoId, data) => {
//     if (data instanceof FormData) {
//       return apiClient.patch(`/videos/${videoId}`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     }
//     return apiClient.patch(`/videos/${videoId}`, data);
//   },

//   // Delete video
//   deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),

//   // Toggle publish status
//   togglePublishStatus: (videoId) =>
//     apiClient.patch(`/videos/toggle/publish/${videoId}`),

//   // Get video stats
//   getVideoStats: (videoId) => apiClient.get(`/videos/stats/${videoId}`),

//   // Get upload status
//   getUploadStatus: (videoId) => apiClient.get(`/videos/status/${videoId}`),

//   // Get categories
//   getCategories: () => apiClient.get("/videos/categories"),

//   // Get user videos
//   getUserVideos: (userId, params = {}) => {
//     const queryParams = new URLSearchParams();

//     Object.keys(params).forEach((key) => {
//       if (params[key] !== undefined && params[key] !== "") {
//         queryParams.append(key, params[key]);
//       }
//     });

//     return apiClient.get(`/videos/user/${userId}?${queryParams.toString()}`);
//   },
// };
// src/services/videoAPI.js
import apiClient from "./api";

export const videoAPI = {
  // ==========================================
  // PUBLIC VIDEO ENDPOINTS
  // ==========================================

  // Get all videos with optional filters
  getAllVideos: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/videos?${queryParams.toString()}`);
  },

  // Get trending videos with optional params
  getTrendingVideos: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/videos/trending?${queryParams.toString()}`);
  },

  // Search videos by query and filter params
  searchVideos: (query, params = {}) => {
    const queryParams = new URLSearchParams({ q: query });
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/videos/search?${queryParams.toString()}`);
  },

  // Get single video by ID
  getVideoById: (videoId) => apiClient.get(`/videos/${videoId}`),

  // Get video categories
  getCategories: () => apiClient.get("/videos/categories"),

  // Get videos uploaded by a user, supports filters
  getUserVideos: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/videos/user/${userId}?${queryParams.toString()}`);
  },

  // ==========================================
  // PROTECTED VIDEO ENDPOINTS (Require Auth)
  // ==========================================

  // Upload new video with optional progress callback
  uploadVideo: (formData, onUploadProgress) => {
    return apiClient.post("/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  // Update video by ID, supports FormData or plain JSON
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

  // Delete video by ID
  deleteVideo: (videoId) => apiClient.delete(`/videos/${videoId}`),

  // Toggle publish status
  togglePublishStatus: (videoId) =>
    apiClient.patch(`/videos/toggle/publish/${videoId}`),

  // Get video stats
  getVideoStats: (videoId) => apiClient.get(`/videos/stats/${videoId}`),

  // Get video upload status
  getUploadStatus: (videoId) => apiClient.get(`/videos/status/${videoId}`),

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  // Validate video data before upload
  validateVideoData: (formData) => {
    const title = formData.get("title");
    const videoFile = formData.get("videoFile");

    if (!title || title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters long");
    }

    if (!videoFile) {
      throw new Error("Video file is required");
    }

    return true;
  },

  // Format video duration
  formatDuration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  },

  // Format view count
  formatViews: (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views?.toString() || "0";
    }
  },
};

// Named exports for individual functions (optional)
export const {
  getAllVideos,
  getTrendingVideos,
  searchVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getVideoStats,
  getUploadStatus,
  getCategories,
  getUserVideos,
} = videoAPI;

// Default export
export default videoAPI;
