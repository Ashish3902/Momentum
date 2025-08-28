// src/services/api.js - BEST VERSION
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add token to every request
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

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // If no refresh token, redirect to login
      if (!refreshToken) {
        console.log("No refresh token available");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");

        // Make refresh request
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          { refreshToken },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000, // 10 second timeout
          }
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Update tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        console.log("Token refreshed successfully");

        // Update default headers
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Process queued requests with error
        processQueue(refreshError, null);

        // Clear all auth data and redirect
        localStorage.clear();

        // Show user-friendly message
        if (window.location.pathname !== "/login") {
          alert("Your session has expired. Please log in again.");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Enhanced auth API with better error handling
export const authAPI = {
  login: async (data) => {
    try {
      const response = await apiClient.post("/users/login", data);
      const { accessToken, refreshToken, user } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Update default headers
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      console.log("Login successful");
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  register: (formData) =>
    apiClient.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  logout: async () => {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear all auth data regardless of API call result
      localStorage.clear();
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  },

  getCurrentUser: () => apiClient.get("/users/current-user"),

  updateProfile: (data) => apiClient.patch("/users/profile", data),

  resetPasswordRequest: (email) =>
    apiClient.post("/users/password/reset/request", { email }),

  resetPassword: (data) => apiClient.post("/users/password/reset", data),
};

// Utility functions
export const tokenUtils = {
  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  },

  clearAuthData: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeUser("user");
    delete apiClient.defaults.headers.common["Authorization"];
  },

  setAuthToken: (token) => {
    localStorage.setItem("accessToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
};

export default apiClient;
