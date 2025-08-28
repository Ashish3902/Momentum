// src/pages/History.jsx - Dedicated History Page
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { libraryAPI } from "../services/libraryAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  ClockIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const History = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory(true);
  }, []);

  const fetchHistory = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await libraryAPI.getWatchHistory({
        page: currentPage,
        limit: 12,
      });

      const newVideos = response?.data?.data?.docs || [];

      if (reset) {
        setVideos(newVideos);
        setPage(2);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }

      setHasMore(response?.data?.data?.hasNextPage || false);
      setTotalVideos(response?.data?.data?.totalDocs || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load watch history");

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await libraryAPI.removeFromHistory(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      setTotalVideos((prev) => Math.max(0, prev - 1));
      toast.success("Video removed from history");
    } catch (error) {
      console.error("Error removing video from history:", error);
      toast.error("Failed to remove video from history");
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire watch history? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await libraryAPI.clearHistory();
      setVideos([]);
      setPage(1);
      setHasMore(false);
      setTotalVideos(0);
      toast.success("Watch history cleared successfully!");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear watch history");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center mb-2">
              <button
                onClick={() => navigate("/library")}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <ClockIcon className="w-8 h-8 mr-3 text-blue-600" />
                Watch History
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-16">
              {totalVideos > 0
                ? `${totalVideos} videos watched`
                : "Videos you watch will appear here"}
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
          transition={{ delay: 0.2 }}
        >
          {loading && videos.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : videos.length > 0 ? (
            <>
              <VideoGrid
                videos={videos}
                loading={false}
                listType="history"
                showRemoveFromHistory={true}
                onRemoveFromHistory={handleRemoveVideo}
              />

              {/* Load More */}
              {hasMore && !loading && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchHistory(false)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Load More History
                  </motion.button>
                </div>
              )}

              {/* Loading More */}
              {loading && page > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                No watch history yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Videos you watch will appear here so you can easily find them
                later
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Watching
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default History;
