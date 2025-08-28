// src/hooks/useWatchLater.js - Complete error handling hook
import { useState, useEffect } from "react";
import { libraryAPI } from "../services/libraryAPI";
import toast from "react-hot-toast";

export const useWatchLater = () => {
  const [watchLaterVideos, setWatchLaterVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchWatchLater = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      console.log("Fetching watch later, page:", currentPage);

      const response = await libraryAPI.getWatchLater({
        page: currentPage,
        limit: 12,
      });

      console.log("Watch later response:", response);

      if (!response?.data?.data) {
        throw new Error("Invalid response format from server");
      }

      const newVideos = response.data.data.docs || [];

      if (reset) {
        setWatchLaterVideos(newVideos);
        setPage(2);
      } else {
        setWatchLaterVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }

      setHasMore(response.data.data.hasNextPage || false);
    } catch (error) {
      console.error("Watch later fetch error:", error);

      // Enhanced error handling
      let errorMessage = "Failed to load watch later videos";

      if (error.response) {
        // Server responded with error status
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);

        switch (error.response.status) {
          case 401:
            errorMessage = "Please log in to access your watch later list";
            // Redirect to login
            window.location.href = "/login";
            break;
          case 404:
            errorMessage =
              "Watch later feature not available. Please contact support.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request made but no response received
        console.log("No response received:", error.request);
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Something else happened
        console.log("Request setup error:", error.message);
        errorMessage = error.message || "An unexpected error occurred";
      }

      setError(errorMessage);
      toast.error(errorMessage);

      if (reset) {
        setWatchLaterVideos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToWatchLater = async (videoId, videoTitle = "Video") => {
    try {
      console.log("Adding to watch later:", videoId);

      const response = await libraryAPI.addToWatchLater(videoId);
      console.log("Add response:", response);

      toast.success(`Added "${videoTitle}" to Watch Later`);

      // Refresh the list
      await fetchWatchLater(true);
    } catch (error) {
      console.error("Add to watch later error:", error);

      let errorMessage = "Failed to add to Watch Later";

      if (error.response?.status === 400) {
        errorMessage = "Video already in Watch Later list";
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to save videos";
      } else if (error.response?.status === 404) {
        errorMessage = "Video not found";
      }

      toast.error(errorMessage);
      throw error;
    }
  };

  const removeFromWatchLater = async (videoId, videoTitle = "Video") => {
    try {
      console.log("Removing from watch later:", videoId);

      await libraryAPI.removeFromWatchLater(videoId);

      // Update local state immediately
      setWatchLaterVideos((prev) =>
        prev.filter((video) => video._id !== videoId)
      );

      toast.success(`Removed "${videoTitle}" from Watch Later`);
    } catch (error) {
      console.error("Remove from watch later error:", error);
      toast.error("Failed to remove from Watch Later");

      // Refresh list to ensure consistency
      fetchWatchLater(true);
    }
  };

  return {
    watchLaterVideos,
    loading,
    error,
    hasMore,
    fetchWatchLater,
    addToWatchLater,
    removeFromWatchLater,
  };
};
