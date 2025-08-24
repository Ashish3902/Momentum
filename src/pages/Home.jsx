import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import VideoGrid from "../components/video/VideoGrid.jsx";
import { videoAPI } from "../services/videoAPI";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import VideoCard from "../components/video/VideoCard.jsx";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await videoAPI.getCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch trending videos
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        setTrendingLoading(true);
        const response = await videoAPI.getTrendingVideos({ limit: 10 });
        setTrendingVideos(response.data.data?.docs || []);
      } catch (error) {
        console.error("Error fetching trending videos:", error);
        toast.error("Failed to load trending videos");
      } finally {
        setTrendingLoading(false);
      }
    };
    fetchTrendingVideos();
  }, []);

  // Fetch videos
  const fetchVideos = async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;

      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
      };

      const response = await videoAPI.getAllVideos(params);
      const newVideos = response.data.data?.docs || [];

      if (resetPage) {
        setVideos(newVideos);
        setPage(2);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }

      setHasMore(response.data.data?.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and category change
  useEffect(() => {
    fetchVideos(true);
  }, [selectedCategory]);

  // Load more videos
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Trending Section */}
      <section className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🔥 Trending Now
          </h2>

          {trendingLoading ? (
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex-none w-80 animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 aspect-video rounded-xl mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {trendingVideos.map((video) => (
                <div key={video._id} className="flex-none w-80">
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              All
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <VideoGrid videos={videos} loading={loading && page === 1} />

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
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

        {/* No More Videos */}
        {!hasMore && videos.length > 0 && (
          <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
            No more videos to load
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
