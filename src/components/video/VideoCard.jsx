import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayIcon,
  EyeIcon,
  HandThumbUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

const VideoCard = ({ video, className = "" }) => {
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

  const formatViews = (views) => {
    if (!views) return "0 views";
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}
    >
      {/* Video Thumbnail */}
      <Link to={`/watch/${video._id}`} className="block relative">
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center">
            <ClockIcon className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </Link>

      {/* Video Info */}
      <div className="p-4">
        {/* Channel Info */}
        <div className="flex items-center space-x-3 mb-3">
          <Link to={`/channel/${video.owner.username}`}>
            <img
              src={video.owner.avatar}
              alt={video.owner.fullName || video.owner.username}
              className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={`/watch/${video._id}`}
              className="block text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
            >
              {video.title}
            </Link>
            <Link
              to={`/channel/${video.owner.username}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {video.owner.fullName || video.owner.username}
            </Link>
          </div>
        </div>

        {/* Video Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              {formatViews(video.views)}
            </div>
            <div className="flex items-center">
              <HandThumbUpIcon className="w-4 h-4 mr-1" />
              {video.likes || 0}
            </div>
          </div>
          <span>
            {formatDistanceToNow(new Date(video.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Category Badge */}
        {video.category && (
          <div className="mt-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              {video.category}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
