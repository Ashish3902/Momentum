// src/services/subscriptionAPI.js
import apiClient from "./api";

export const subscriptionAPI = {
  // Toggle subscription
  toggleSubscription: (channelId) =>
    apiClient.post(`/subscriptions/c/${channelId}`),

  // Get channel subscribers
  getChannelSubscribers: (channelId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(
      `/subscriptions/u/${channelId}?${queryParams.toString()}`
    );
  },

  // Get user subscriptions
  getUserSubscriptions: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(
      `/subscriptions/subscribed/${userId}?${queryParams.toString()}`
    );
  },

  // Check if subscribed to a channel
  checkSubscription: async (channelId) => {
    try {
      const response = await apiClient.get(`/subscriptions/check/${channelId}`);
      return response.data.data.isSubscribed;
    } catch (error) {
      return false;
    }
  },
};
