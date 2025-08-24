import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (data) => apiClient.post("/users/login", data),
  register: (formData) =>
    apiClient.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: () => apiClient.post("/users/logout"),
  getCurrentUser: () => apiClient.get("/users/me"),
  updateProfile: (data) => apiClient.patch("/users/profile", data),
  resetPasswordRequest: (email) =>
    apiClient.post("/users/password/reset/request", { email }),
  resetPassword: (data) => apiClient.post("/users/password/reset", data),
};

export default apiClient;
