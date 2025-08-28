// src/components/video/VideoGrid.jsx - Fixed with unique keys
import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({
  videos,
  loading,
  showRemoveFromWatchLater,
  onRemoveFromWatchLater,
  showRemoveFromHistory,
  onRemoveFromHistory,
  listType = "default", // ✅ Add context for unique keys
}) => {
  // ✅ Generate unique key function
  const generateUniqueKey = (video, index, context) => {
    if (video._id) {
      return `${context}-${video._id}-${index}`;
    }
    return `${context}-${index}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={`skeleton-${listType}-${index}`} className="animate-pulse">
            <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video, index) => {
        // ✅ FIXED: Create unique key combining context + id + index
        const uniqueKey = generateUniqueKey(video, index, listType);

        return (
          <VideoCard
            key={uniqueKey} // ✅ Now truly unique across all contexts
            video={video}
            showRemoveFromWatchLater={showRemoveFromWatchLater}
            onRemoveFromWatchLater={onRemoveFromWatchLater}
            showRemoveFromHistory={showRemoveFromHistory}
            onRemoveFromHistory={onRemoveFromHistory}
          />
        );
      })}
    </div>
  );
};

export default VideoGrid;
