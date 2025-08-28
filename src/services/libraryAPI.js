// src/services/libraryAPI.js - Frontend API Service
import apiClient from "./api";

export const libraryAPI = {
  // ==========================================
  // WATCH LATER API CALLS
  // ==========================================

  // Get Watch Later Videos
  getWatchLater: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== "") {
          queryParams.append(key, params[key]);
        }
      });

      console.log("📚 API: Getting watch later videos...");
      const response = await apiClient.get(
        `/library/watchlater?${queryParams.toString()}`
      );
      console.log("✅ API: Watch later videos fetched");
      return response;
    } catch (error) {
      console.error("❌ API: Error fetching watch later:", error);
      throw error;
    }
  },

  // Add to Watch Later
  addToWatchLater: async (videoId) => {
    try {
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      console.log(`➕ API: Adding video ${videoId} to watch later...`);
      const response = await apiClient.post("/library/watchlater", { videoId });
      console.log("✅ API: Video added to watch later");
      return response;
    } catch (error) {
      console.error("❌ API: Error adding to watch later:", error);
      throw error;
    }
  },

  // Remove from Watch Later
  removeFromWatchLater: async (videoId) => {
    try {
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      console.log(`➖ API: Removing video ${videoId} from watch later...`);
      const response = await apiClient.delete(`/library/watchlater/${videoId}`);
      console.log("✅ API: Video removed from watch later");
      return response;
    } catch (error) {
      console.error("❌ API: Error removing from watch later:", error);
      throw error;
    }
  },

  // ==========================================
  // WATCH HISTORY API CALLS
  // ==========================================

  // Get Watch History
  getWatchHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== "") {
          queryParams.append(key, params[key]);
        }
      });

      console.log("📚 API: Getting watch history...");
      const response = await apiClient.get(
        `/library/history?${queryParams.toString()}`
      );
      console.log("✅ API: Watch history fetched");
      return response;
    } catch (error) {
      console.error("❌ API: Error fetching history:", error);
      throw error;
    }
  },

  // Add to History
  addToHistory: async (videoId, watchData = {}) => {
    try {
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      const payload = {
        videoId,
        watchDuration: watchData.duration || 0,
        completed: watchData.completed || false,
      };

      console.log(`➕ API: Adding video ${videoId} to history...`);
      const response = await apiClient.post("/library/history", payload);
      console.log("✅ API: Video added to history");
      return response;
    } catch (error) {
      console.error("❌ API: Error adding to history:", error);
      // Don't throw for history errors - they're not critical
      return null;
    }
  },

  // Remove from History
  removeFromHistory: async (videoId) => {
    try {
      if (!videoId) {
        throw new Error("Video ID is required");
      }

      console.log(`➖ API: Removing video ${videoId} from history...`);
      const response = await apiClient.delete(`/library/history/${videoId}`);
      console.log("✅ API: Video removed from history");
      return response;
    } catch (error) {
      console.error("❌ API: Error removing from history:", error);
      throw error;
    }
  },

  // Clear History
  clearHistory: async () => {
    try {
      console.log("🗑️ API: Clearing all history...");
      const response = await apiClient.delete("/library/history");
      console.log("✅ API: History cleared");
      return response;
    } catch (error) {
      console.error("❌ API: Error clearing history:", error);
      throw error;
    }
  },

  // ==========================================
  // LIKED VIDEOS API CALLS
  // ==========================================

  // Get Liked Videos
  getLikedVideos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== "") {
          queryParams.append(key, params[key]);
        }
      });

      console.log("❤️ API: Getting liked videos...");
      const response = await apiClient.get(
        `/library/liked?${queryParams.toString()}`
      );
      console.log("✅ API: Liked videos fetched");
      return response;
    } catch (error) {
      console.error("❌ API: Error fetching liked videos:", error);
      throw error;
    }
  },

  // ==========================================
  // UTILITY API CALLS
  // ==========================================

  // Get Library Status
  getLibraryStatus: async () => {
    try {
      console.log("🔍 API: Getting library status...");
      const response = await apiClient.get("/library/status");
      console.log("✅ API: Library status fetched");
      return response;
    } catch (error) {
      console.error("❌ API: Error fetching library status:", error);
      throw error;
    }
  },
};

// Export default
export default libraryAPI;
