// src/services/subscriptionAPI.js - Fix the API calls
import apiClient from "./api";

export const subscriptionAPI = {
  // Subscribe to channel
  subscribe: (channelId) => apiClient.post("/users/subscribe", { channelId }),

  // Unsubscribe from channel
  unsubscribe: (channelId) =>
    apiClient.post("/users/unsubscribe", { channelId }),

  // Check subscription status
  checkSubscription: (channelId) =>
    apiClient.get(`/users/subscription/${channelId}`),
};
