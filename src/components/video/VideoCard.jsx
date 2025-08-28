// src/components/video/VideoCard.jsx - Add watch later button
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { libraryAPI } from "../../services/libraryAPI";
import toast from "react-hot-toast";
import { BookmarkIcon, PlayIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

const VideoCard = ({ video }) => {
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWatchLater = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark
    e.stopPropagation();

    if (!video?._id) return;

    try {
      setLoading(true);

      if (isInWatchLater) {
        await libraryAPI.removeFromWatchLater(video._id);
        setIsInWatchLater(false);
        toast.success("Removed from Watch Later");
      } else {
        await libraryAPI.addToWatchLater(video._id);
        setIsInWatchLater(true);
        toast.success("Added to Watch Later");
      }
    } catch (error) {
      console.error("Watch later error:", error);
      if (
        error.response?.status === 400 &&
        error.response?.data?.message?.includes("already")
      ) {
        setIsInWatchLater(true);
        toast.error("Video already in watch later");
      } else {
        toast.error("Failed to update watch later");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = async () => {
    // Add to history when video is clicked
    try {
      await libraryAPI.addToHistory(video._id);
    } catch (error) {
      console.error("Failed to add to history:", error);
    }
  };

  return (
    <Link
      to={`/watch/${video._id}`}
      onClick={handleVideoClick}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {Math.floor(video.duration / 60)}:
            {(video.duration % 60).toString().padStart(2, "0")}
          </div>
        )}

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayIcon className="w-12 h-12 text-white drop-shadow-lg" />
        </div>

        {/* Watch Later Button */}
        <button
          onClick={handleWatchLater}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title={
            isInWatchLater ? "Remove from Watch Later" : "Add to Watch Later"
          }
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : isInWatchLater ? (
            <BookmarkSolid className="w-5 h-5" />
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
          {video.title}
        </h3>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <img
            src={video.owner?.avatar}
            alt={video.owner?.username}
            className="w-6 h-6 rounded-full"
          />
          <span>{video.owner?.username}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>{video.views?.toLocaleString()} views</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
