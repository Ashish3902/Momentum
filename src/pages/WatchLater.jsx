// src/pages/WatchLater.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { watchLaterAPI } from "../services/watchLaterAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import { BookmarkIcon } from "@heroicons/react/24/outline";

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchWatchLater(true);
  }, []);

  const fetchWatchLater = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await watchLaterAPI.getWatchLater({
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
      console.error("Error fetching watch later:", error);
      toast.error("Failed to load watch later videos");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await watchLaterAPI.removeFromWatchLater(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Removed from Watch Later");
    } catch (error) {
      console.error("Error removing from watch later:", error);
      toast.error("Failed to remove from Watch Later");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <BookmarkIcon className="w-8 h-8 mr-3 text-green-600" />
            Watch Later
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Videos you've saved to watch when you have time
          </p>
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
            showRemoveFromWatchLater={true}
            onRemoveFromWatchLater={handleRemoveVideo}
          />

          {/* Load More */}
          {hasMore && !loading && videos.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => fetchWatchLater(false)}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
              >
                Load More Videos
              </button>
            </div>
          )}

          {/* Empty State */}
          {videos.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No videos saved for later
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save videos to watch them when you have more time. Look for the
                bookmark icon on videos!
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WatchLater;
