// src/pages/Library.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { likeAPI } from "../services/likeAPI";
import { historyAPI } from "../services/historyAPI";
import { watchLaterAPI } from "../services/watchLaterAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  HeartIcon,
  ClockIcon,
  BookmarkIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  ClockIcon as ClockIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";

const Library = () => {
  const [activeTab, setActiveTab] = useState("liked");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tabs = [
    {
      id: "liked",
      label: "Liked Videos",
      icon: HeartIcon,
      iconSolid: HeartIconSolid,
      color: "text-red-600",
    },
    {
      id: "history",
      label: "Watch History",
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      color: "text-blue-600",
    },
    {
      id: "watchlater",
      label: "Watch Later",
      icon: BookmarkIcon,
      iconSolid: BookmarkIconSolid,
      color: "text-green-600",
    },
  ];

  useEffect(() => {
    setPage(1);
    fetchData(true);
  }, [activeTab]);

  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      let response;

      const params = {
        page: currentPage,
        limit: 12,
      };

      switch (activeTab) {
        case "liked":
          response = await likeAPI.getLikedVideos(params);
          break;
        case "history":
          response = await historyAPI.getWatchHistory(params);
          break;
        case "watchlater":
          response = await watchLaterAPI.getWatchLater(params);
          break;
        default:
          return;
      }

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
      console.error("Error fetching library data:", error);
      toast.error(`Failed to load ${activeTab} videos`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your watch history? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await historyAPI.clearHistory();
      setVideos([]);
      toast.success("Watch history cleared successfully!");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear watch history");
    }
  };

  const handleRemoveFromWatchLater = async (videoId) => {
    try {
      await watchLaterAPI.removeFromWatchLater(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Removed from Watch Later");
    } catch (error) {
      console.error("Error removing from watch later:", error);
      toast.error("Failed to remove from Watch Later");
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "liked":
        return "You haven't liked any videos yet. Start exploring and like videos you enjoy!";
      case "history":
        return "Your watch history is empty. Videos you watch will appear here.";
      case "watchlater":
        return "No videos saved for later. Add videos to watch them when you have time!";
      default:
        return "No videos found.";
    }
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);

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
            <EyeIcon className="w-8 h-8 mr-3 text-blue-600" />
            Your Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access your liked videos, watch history, and saved content
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = activeTab === tab.id ? tab.iconSolid : tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? `border-blue-600 ${tab.color} dark:text-blue-400`
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                    {videos.length > 0 && activeTab === tab.id && (
                      <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {videos.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Action Bar */}
        {activeTab === "history" && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-end"
          >
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear History</span>
            </button>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stats Banner */}
          {videos.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center">
                <currentTab.iconSolid
                  className={`w-12 h-12 ${currentTab.color} mr-4`}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {videos.length}{" "}
                    {activeTab === "history"
                      ? "videos watched"
                      : activeTab === "liked"
                      ? "videos liked"
                      : "videos saved"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeTab === "history"
                      ? "Your viewing history"
                      : activeTab === "liked"
                      ? "Videos you've liked"
                      : "Saved for later viewing"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Video Grid */}
          <VideoGrid
            videos={videos}
            loading={loading && page === 1}
            showRemoveFromWatchLater={activeTab === "watchlater"}
            onRemoveFromWatchLater={handleRemoveFromWatchLater}
          />

          {/* Load More */}
          {hasMore && !loading && videos.length > 0 && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchData(false)}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Load More Videos
              </motion.button>
            </div>
          )}

          {/* Loading More */}
          {loading && page > 1 && (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty State */}
          {videos.length === 0 && !loading && (
            <div className="text-center py-12">
              <currentTab.icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No {activeTab} videos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {getEmptyMessage()}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Library;
