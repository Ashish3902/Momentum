// src/services/searchAPI.js - Frontend search API
import apiClient from "./api";

export const searchAPI = {
  // ==========================================
  // VIDEO SEARCH
  // ==========================================

  searchVideos: async (query, options = {}) => {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Search query is required");
      }

      const params = new URLSearchParams({
        query: query.trim(),
        page: options.page || 1,
        limit: options.limit || 12,
        sortBy: options.sortBy || "relevance",
        filter: options.filter || "all",
      });

      console.log(`🔍 API: Searching videos for "${query}"`);
      const response = await apiClient.get(
        `/search/videos?${params.toString()}`
      );
      console.log(`✅ API: Found ${response.data.data.videos.length} videos`);
      return response;
    } catch (error) {
      console.error("❌ API: Video search error:", error);
      throw error;
    }
  },

  // ==========================================
  // USER SEARCH
  // ==========================================

  searchUsers: async (query, options = {}) => {
    try {
      if (!query || query.trim() === "") {
        throw new Error("Search query is required");
      }

      const params = new URLSearchParams({
        query: query.trim(),
        page: options.page || 1,
        limit: options.limit || 10,
      });

      console.log(`🔍 API: Searching users for "${query}"`);
      const response = await apiClient.get(
        `/search/users?${params.toString()}`
      );
      console.log(`✅ API: Found ${response.data.data.users.length} users`);
      return response;
    } catch (error) {
      console.error("❌ API: User search error:", error);
      throw error;
    }
  },

  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================

  getSearchSuggestions: async (query, limit = 5) => {
    try {
      if (!query || query.trim() === "") {
        return { data: { data: { suggestions: [] } } };
      }

      const params = new URLSearchParams({
        query: query.trim(),
        limit: limit,
      });

      const response = await apiClient.get(
        `/search/suggestions?${params.toString()}`
      );
      return response;
    } catch (error) {
      console.error("❌ API: Search suggestions error:", error);
      // Don't throw for suggestions - just return empty
      return { data: { data: { suggestions: [] } } };
    }
  },

  // ==========================================
  // SEARCH STATUS
  // ==========================================

  getSearchStatus: async () => {
    try {
      const response = await apiClient.get("/search/status");
      return response;
    } catch (error) {
      console.error("❌ API: Search status error:", error);
      throw error;
    }
  },
};

export default searchAPI;
