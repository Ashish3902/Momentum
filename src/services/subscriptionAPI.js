import apiClient from "./api";

export const subscriptionAPI = {
  // Subscribe to channel
  subscribe: (channelId) => apiClient.post("/users/subscribe", { channelId }),

  // Unsubscribe from channel
  unsubscribe: (channelId) =>
    apiClient.post("/users/unsubscribe", { channelId }),

  // Get channel profile with stats
  getChannelProfile: (channelId) =>
    apiClient.get(`/users/channel/${channelId}`),

  // Get user's subscribed channels
  getSubscribedChannels: () => apiClient.get("/users/subscribed"),

  // Get channel subscribers
  getChannelSubscribers: (channelId) =>
    apiClient.get(`/users/subscribers/${channelId}`),
};
