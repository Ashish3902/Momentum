const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  // Future endpoints based on your backend features
  PROFILE: `${API_BASE_URL}/users/profile`,
  FILE_UPLOAD: `${API_BASE_URL}/upload`,
};

export default API_BASE_URL;
