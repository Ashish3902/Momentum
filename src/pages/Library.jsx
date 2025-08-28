// src/pages/Library.jsx - Main Library Page
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { libraryAPI } from "../services/libraryAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  HeartIcon,
  ClockIcon,
  BookmarkIcon,
  TrashIcon,
  EyeIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  ClockIcon as ClockIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";

const Library = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("liked");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);
  const [stats, setStats] = useState({
    watchLater: 0,
    history: 0,
    liked: 0,
  });

  const tabs = [
    {
      id: "liked",
      label: "Liked Videos",
      icon: HeartIcon,
      iconSolid: HeartIconSolid,
      color: "text-red-600",
      route: "/library/liked",
    },
    {
      id: "history",
      label: "Watch History",
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      color: "text-blue-600",
      route: "/library/history",
    },
    {
      id: "watchlater",
      label: "Watch Later",
      icon: BookmarkIcon,
      iconSolid: BookmarkIconSolid,
      color: "text-green-600",
      route: "/library/watchlater",
    },
  ];

  // Load initial data
  useEffect(() => {
    loadLibraryStats();
    setPage(1);
    setVideos([]);
    setError(null);
    fetchData(true);
  }, [activeTab]);

  // Load library statistics
  const loadLibraryStats = async () => {
    try {
      // Load counts for each category (you can optimize this)
      const [likedRes, historyRes, watchLaterRes] = await Promise.all([
        libraryAPI.getLikedVideos({ page: 1, limit: 1 }),
        libraryAPI.getWatchHistory({ page: 1, limit: 1 }),
        libraryAPI.getWatchLater({ page: 1, limit: 1 }),
      ]);

      setStats({
        liked: likedRes?.data?.data?.totalDocs || 0,
        history: historyRes?.data?.data?.totalDocs || 0,
        watchLater: watchLaterRes?.data?.data?.totalDocs || 0,
      });
    } catch (error) {
      console.error("Error loading library stats:", error);
    }
  };

  // Fetch data based on active tab
  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      let response;

      const params = {
        page: currentPage,
        limit: 12,
      };

      console.log(`🔍 Fetching ${activeTab} data...`);

      switch (activeTab) {
        case "liked":
          response = await libraryAPI.getLikedVideos(params);
          break;
        case "history":
          response = await libraryAPI.getWatchHistory(params);
          break;
        case "watchlater":
          response = await libraryAPI.getWatchLater(params);
          break;
        default:
          throw new Error("Invalid tab selected");
      }

      console.log(`✅ ${activeTab} response:`, response);

      const newVideos = response?.data?.data?.docs || [];
      const totalCount = response?.data?.data?.totalDocs || 0;
      const hasNextPage = response?.data?.data?.hasNextPage || false;

      if (reset) {
        setVideos(newVideos);
        setPage(2);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }

      setHasMore(hasNextPage);
      setTotalVideos(totalCount);

      console.log(
        `📊 Total: ${totalCount}, Current: ${newVideos.length}, HasMore: ${hasNextPage}`
      );
    } catch (error) {
      console.error(`❌ Error fetching ${activeTab}:`, error);

      let errorMessage = `Failed to load ${activeTab} videos`;

      if (error.response?.status === 401) {
        errorMessage = "Please log in to access your library";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 404) {
        errorMessage = `${activeTab} feature not found. Please check backend.`;
      }

      setError(errorMessage);
      toast.error(errorMessage);

      if (reset) {
        setVideos([]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to specific pages
  const handleTabClick = (tab) => {
    if (tab.route) {
      navigate(tab.route);
    } else {
      setActiveTab(tab.id);
    }
  };

  // Handle remove from watch later
  const handleRemoveFromWatchLater = async (videoId) => {
    try {
      await libraryAPI.removeFromWatchLater(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      setTotalVideos((prev) => Math.max(0, prev - 1));
      setStats((prev) => ({
        ...prev,
        watchLater: Math.max(0, prev.watchLater - 1),
      }));
      toast.success("Removed from Watch Later");
    } catch (error) {
      console.error("Error removing from watch later:", error);
      toast.error("Failed to remove from Watch Later");
    }
  };

  // Handle remove from history
  const handleRemoveFromHistory = async (videoId) => {
    try {
      await libraryAPI.removeFromHistory(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      setTotalVideos((prev) => Math.max(0, prev - 1));
      setStats((prev) => ({ ...prev, history: Math.max(0, prev.history - 1) }));
      toast.success("Removed from History");
    } catch (error) {
      console.error("Error removing from history:", error);
      toast.error("Failed to remove from History");
    }
  };

  // Handle clear history
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
      setHasMore(false);
      setTotalVideos(0);
      setStats((prev) => ({ ...prev, history: 0 }));
      toast.success("Watch history cleared successfully!");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear watch history");
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

        {/* Library Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.iconSolid;
            const count = stats[tab.id] || 0;
            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {tab.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {count}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${tab.color}`} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                    {totalVideos > 0 && activeTab === tab.id && (
                      <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {totalVideos}
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
            transition={{ delay: 0.3 }}
            className="mb-6 flex justify-between items-center"
          >
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/library/history")}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlayIcon className="w-4 h-4" />
                <span>View Full History</span>
              </button>
            </div>
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
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-semibold mb-2">
                ❌ Error Loading {activeTab}
              </h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => fetchData(true)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && videos.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading {activeTab} videos...
                </p>
              </div>
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Video Grid */}
              <VideoGrid
                videos={videos}
                loading={false}
                listType={activeTab}
                showRemoveFromWatchLater={activeTab === "watchlater"}
                onRemoveFromWatchLater={handleRemoveFromWatchLater}
                showRemoveFromHistory={activeTab === "history"}
                onRemoveFromHistory={handleRemoveFromHistory}
              />

              {/* Load More */}
              {hasMore && !loading && (
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
            </>
          ) : (
            !error && (
              /* Empty State */
              <div className="text-center py-12">
                <currentTab.icon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  No {activeTab} videos yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {getEmptyMessage()}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Discover Videos
                </button>
              </div>
            )
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Library;
