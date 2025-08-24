import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { videoAPI } from "../services/videoAPI";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  PlayIcon,
  ClockIcon,
  GlobeAltIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

const CreatorStudio = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [viewFilter, setViewFilter] = useState("all"); // all, published, unpublished
  const [sortBy, setSortBy] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVideos(true);
    }
  }, [user, viewFilter, sortBy]);

  const fetchVideos = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const params = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortType: "desc",
      };

      // Add filter for published status
      if (viewFilter === "published") {
        params.isPublished = true;
      } else if (viewFilter === "unpublished") {
        params.isPublished = false;
      }

      const response = await videoAPI.getUserVideos(user._id, params);
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
      console.error("Error fetching videos:", error);
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await videoAPI.deleteVideo(videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const handleTogglePublish = async (videoId) => {
    try {
      await videoAPI.togglePublishStatus(videoId);
      // Refresh videos to show updated status
      fetchVideos(true);
      toast.success("Video status updated!");
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update video status");
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVideos(
      selectedVideos.length === videos.length
        ? []
        : videos.map((video) => video._id)
    );
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedVideos.length} video(s)? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await Promise.all(
        selectedVideos.map((videoId) => videoAPI.deleteVideo(videoId))
      );
      setVideos((prev) =>
        prev.filter((video) => !selectedVideos.includes(video._id))
      );
      setSelectedVideos([]);
      toast.success(`${selectedVideos.length} video(s) deleted successfully!`);
    } catch (error) {
      console.error("Error deleting videos:", error);
      toast.error("Failed to delete some videos");
    }
  };

  const formatViews = (views) => {
    if (!views) return "0";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Creator Studio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your videos and channel
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Upload Video
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PlayIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Videos
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {videos.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <EyeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Views
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatViews(
                    videos.reduce((acc, video) => acc + (video.views || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {videos.filter((v) => v.isPublished).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {videos.filter((v) => !v.isPublished).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* View Filter */}
              <select
                value={viewFilter}
                onChange={(e) => setViewFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Videos</option>
                <option value="published">Published</option>
                <option value="unpublished">Drafts</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="createdAt">Newest First</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedVideos.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedVideos.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Videos Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          {loading && videos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : videos.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedVideos.length === videos.length &&
                      videos.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                    Select All
                  </span>
                </div>
              </div>

              {/* Videos List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(video._id)}
                        onChange={() => handleSelectVideo(video._id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />

                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                              {video.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center">
                                {video.isPublished ? (
                                  <>
                                    <GlobeAltIcon className="w-3 h-3 mr-1" />
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <EyeSlashIcon className="w-3 h-3 mr-1" />
                                    Draft
                                  </>
                                )}
                              </span>
                              <span>{formatViews(video.views)} views</span>
                              <span>{video.likes || 0} likes</span>
                              <span>
                                {formatDistanceToNow(
                                  new Date(video.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            <Link
                              to={`/watch/${video._id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="View Video"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>

                            <Link
                              to={`/studio/edit/${video._id}`}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Edit Video"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleTogglePublish(video._id)}
                              className={`p-2 transition-colors ${
                                video.isPublished
                                  ? "text-gray-400 hover:text-orange-600"
                                  : "text-gray-400 hover:text-green-600"
                              }`}
                              title={
                                video.isPublished ? "Unpublish" : "Publish"
                              }
                            >
                              {video.isPublished ? (
                                <EyeSlashIcon className="w-4 h-4" />
                              ) : (
                                <GlobeAltIcon className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteVideo(video._id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Video"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button
                    onClick={() => fetchVideos(false)}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <PlayIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No videos yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload your first video to get started!
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Upload Video
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorStudio;
