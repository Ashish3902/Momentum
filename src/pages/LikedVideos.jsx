// src/pages/LikedVideos.jsx - Dedicated Liked Videos Page
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { libraryAPI } from "../services/libraryAPI";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import { HeartIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const LikedVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    fetchLikedVideos(true);
  }, []);

  const fetchLikedVideos = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await libraryAPI.getLikedVideos({
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
      console.error("Error fetching liked videos:", error);
      toast.error("Failed to load liked videos");

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
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
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate("/library")}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <HeartSolid className="w-8 h-8 mr-3 text-red-600" />
              Liked Videos
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 ml-16">
            {totalVideos > 0
              ? `${totalVideos} videos liked`
              : "Videos you like will appear here"}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading && videos.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : videos.length > 0 ? (
            <>
              <VideoGrid videos={videos} loading={false} listType="liked" />

              {/* Load More */}
              {hasMore && !loading && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchLikedVideos(false)}
                    className="px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Load More Videos
                  </motion.button>
                </div>
              )}

              {/* Loading More */}
              {loading && page > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <HeartIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                No liked videos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Videos you like will appear here. Start exploring and like
                videos you enjoy!
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Discover Videos
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LikedVideos;
