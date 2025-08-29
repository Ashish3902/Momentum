// // // src/services/api.js
// import axios from "axios";

// // Use environment variable for API URL
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "https://vidora-backend-as.onrender.com/api";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000, // 30 seconds
// });

// // Request interceptor for auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("accessToken");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
// src/services/api.js - COMPLETE API SERVICE
import axios from "axios";

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vidora-backend-as.onrender.com/api";

// Create API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post("/users/refresh-token");
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await apiClient.patch("/users/profile", profileData);
    return response.data;
  },
};

// Video API functions
export const videoAPI = {
  // Get all videos
  getVideos: async (page = 1, limit = 12) => {
    const response = await apiClient.get(`/videos?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get video by ID
  getVideo: async (id) => {
    const response = await apiClient.get(`/videos/${id}`);
    return response.data;
  },

  // Upload video
  uploadVideo: async (formData) => {
    const response = await apiClient.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

// Search API functions
export const searchAPI = {
  // Search videos
  searchVideos: async (query, options = {}) => {
    const params = new URLSearchParams({
      query: query.trim(),
      page: options.page || 1,
      limit: options.limit || 12,
      sortBy: options.sortBy || "relevance",
      filter: options.filter || "all",
    });
    const response = await apiClient.get(`/search/videos?${params}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query, options = {}) => {
    const params = new URLSearchParams({
      query: query.trim(),
      page: options.page || 1,
      limit: options.limit || 10,
    });
    const response = await apiClient.get(`/search/users?${params}`);
    return response.data;
  },
};

// Library API functions
export const libraryAPI = {
  // Watch Later
  getWatchLater: async () => {
    const response = await apiClient.get("/library/watchlater");
    return response.data;
  },

  addToWatchLater: async (videoId) => {
    const response = await apiClient.post("/library/watchlater", { videoId });
    return response.data;
  },

  removeFromWatchLater: async (videoId) => {
    const response = await apiClient.delete(`/library/watchlater/${videoId}`);
    return response.data;
  },

  // Watch History
  getWatchHistory: async () => {
    const response = await apiClient.get("/library/history");
    return response.data;
  },

  // Liked Videos
  getLikedVideos: async () => {
    const response = await apiClient.get("/library/liked");
    return response.data;
  },
};

// Export API client as default
export default apiClient;
