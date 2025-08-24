// src/pages/History.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { historyAPI } from "../services/historyAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import { ClockIcon, TrashIcon } from "@heroicons/react/24/outline";

const History = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchHistory(true);
  }, []);

  const fetchHistory = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await historyAPI.getWatchHistory({
        page: currentPage,
        limit: 12,
      });

      const newVideos = response.data.data?.docs || [];

      if (reset) {
        setVideos(newVideos);
        setPage(2);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }

      setHasMore(response.data.data?.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load watch history");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire watch history?"
      )
    ) {
      return;
    }

    try {
      await historyAPI.clearHistory();
      setVideos([]);
      setPage(1);
      setHasMore(false);
      toast.success("Watch history cleared successfully!");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear watch history");
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await historyAPI.removeFromHistory(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Video removed from history");
    } catch (error) {
      console.error("Error removing video from history:", error);
      toast.error("Failed to remove video from history");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <ClockIcon className="w-8 h-8 mr-3 text-blue-600" />
              Watch History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Videos you've watched recently
            </p>
          </div>

          {videos.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear All History</span>
            </button>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <VideoGrid
            videos={videos}
            loading={loading && page === 1}
            showRemoveFromHistory={true}
            onRemoveFromHistory={handleRemoveVideo}
          />

          {/* Load More */}
          {hasMore && !loading && videos.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => fetchHistory(false)}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Load More History
              </button>
            </div>
          )}

          {/* Empty State */}
          {videos.length === 0 && !loading && (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No watch history yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Videos you watch will appear here so you can easily find them
                later
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
