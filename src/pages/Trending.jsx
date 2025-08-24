import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { videoAPI } from "../services/videoAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  FireIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchTrendingVideos(true);
  }, []);

  useEffect(() => {
    fetchTrendingVideos(true);
  }, [timeRange, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await videoAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTrendingVideos = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await videoAPI.getTrendingVideos({
        page: currentPage,
        limit: 12,
        timeRange,
        ...(selectedCategory && { category: selectedCategory }),
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
      console.error("Error fetching trending videos:", error);
      toast.error("Failed to load trending videos");
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { value: "1d", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <FireIcon className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Videos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover the most popular videos right now
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center mb-4">
            <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Range
              </label>
              <div className="flex space-x-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🔥 What's Hot Right Now
              </h2>
              <p className="text-red-100">
                Showing trending videos from{" "}
                {timeRanges
                  .find((r) => r.value === timeRange)
                  ?.label.toLowerCase()}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{videos.length}</div>
              <div className="text-red-100 text-sm">Trending Videos</div>
            </div>
          </div>
        </motion.div>

        {/* Trending Videos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VideoGrid videos={videos} loading={loading && page === 1} />

          {/* Load More Button */}
          {hasMore && !loading && videos.length > 0 && (
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchTrendingVideos(false)}
                className="px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg"
              >
                Load More Trending Videos
              </motion.button>
            </div>
          )}

          {/* Loading More */}
          {loading && page > 1 && (
            <div className="flex justify-center mt-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}

          {/* No More Videos */}
          {!hasMore && videos.length > 0 && (
            <div className="text-center mt-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                🎉 You've seen all the trending videos!
              </div>
              <button
                onClick={() => {
                  setTimeRange("30d");
                  setSelectedCategory("");
                }}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Try expanding your time range
              </button>
            </div>
          )}

          {/* No Videos Found */}
          {videos.length === 0 && !loading && (
            <div className="text-center py-12">
              <FireIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No trending videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your filters or check back later
              </p>
              <button
                onClick={() => {
                  setTimeRange("7d");
                  setSelectedCategory("");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
        >
          <div className="flex items-center mb-3">
            <EyeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              How Trending Works
            </h3>
          </div>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
            Trending videos are ranked based on a combination of factors
            including view count, likes, comments, and how quickly they're
            gaining popularity. Our algorithm considers both recent engagement
            and overall performance to surface the most relevant content.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Trending;
