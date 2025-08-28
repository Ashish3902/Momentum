// src/services/subscriptionAPI.js
import apiClient from './api';

export const subscriptionAPI = {
  toggleSubscription: (channelId) => apiClient.post(`/subscriptions/c/${channelId}`),
  getChannelSubscribers: (channelId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/subscriptions/u/${channelId}?${queryParams.toString()}`);
  },
  getUserSubscriptions: (userId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    return apiClient.get(`/subscriptions/subscribed/${userId}?${queryParams.toString()}`);
  },
};
