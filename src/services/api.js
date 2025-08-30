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
// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vidora-backend-as.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
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

// Response interceptor
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

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post("/users/refresh-token");
    return response.data;
  },
};

// Export other APIs (videoAPI, searchAPI, libraryAPI) similarly...

export default apiClient;
