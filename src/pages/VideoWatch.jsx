import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { videoAPI } from "../services/videoAPI";
import { likeAPI } from "../services/likeAPI";
import { useAuth } from "../context/AuthContext";
import VideoPlayer from "../components/video/VideoPlayer";
import CommentsSection from "../components/comments/CommentsSection";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  EyeIcon,
  ShareIcon,
  BookmarkIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolid,
  HandThumbDownIcon as HandThumbDownSolid,
} from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { subscriptionAPI } from "../services/subscriptionAPI.js";

const VideoWatch = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideo();
      fetchRelatedVideos();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await videoAPI.getVideoById(id);
      setVideo(response.data.data);
      // TODO: Check if user has liked/disliked this video
    } catch (err) {
      console.error("Error fetching video:", err);
      setError("Failed to load video");
      toast.error("Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const response = await videoAPI.getAllVideos({
        limit: 12,
        sortBy: "views",
        sortType: "desc",
      });
      setRelatedVideos(response.data.data?.docs || []);
    } catch (err) {
      console.error("Error fetching related videos:", err);
    }
  };

  // In VideoWatch.jsx - Fix like toggle
  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please login to like videos");
      return;
    }

    try {
      setLikeProcessing(true);
      await likeAPI.toggleVideoLike(id);

      // Refresh video to get updated like count
      const response = await videoAPI.getVideoById(id);
      setVideo(response.data.data);

      toast.success("Like updated!");
    } catch (error) {
      toast.error("Failed to update like");
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      setSubscribing(true);

      if (isSubscribed) {
        await subscriptionAPI.unsubscribe(channelId);
        setIsSubscribed(false);
        toast.success("Unsubscribed successfully!");
      } else {
        await subscriptionAPI.subscribe(channelId);
        setIsSubscribed(true);
        toast.success("Subscribed successfully!");
      }
    } catch (error) {
      toast.error("Failed to update subscription");
    } finally {
      setSubscribing(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success("Video URL copied to clipboard!");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Video not found"}
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VideoPlayer
                videoUrl={video.videoFile}
                thumbnail={video.thumbnail}
                onTimeUpdate={(currentTime) => {
                  // Track watch time if needed
                  console.log("Current time:", currentTime);
                }}
              />
            </motion.div>

            {/* Video Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {video.title}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {formatViews(video.views)}
                  </div>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(video.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>•</span>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                    {video.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleLike}
                    disabled={likeProcessing}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all ${
                      liked
                        ? "bg-blue-50 border-blue-300 text-blue-600"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {liked ? (
                      <HandThumbUpSolid className="w-5 h-5" />
                    ) : (
                      <HandThumbUpIcon className="w-5 h-5" />
                    )}
                    <span>{video.likes || 0}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <ShareIcon className="w-5 h-5" />
                    <span>Share</span>
                  </button>

                  <button className="flex items-center space-x-2 px-4 py-2 rounded-full border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <BookmarkIcon className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/channel/${video.owner?.username}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                >
                  <img
                    src={video.owner?.avatar}
                    alt={video.owner?.fullName || video.owner?.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {video.owner?.fullName || video.owner?.username}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{video.owner?.username}
                    </p>
                  </div>
                </Link>

                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                  <UserPlusIcon className="w-5 h-5" />
                  <span>Subscribe</span>
                </button>
              </div>

              {/* Description */}
              <div className="mt-4">
                <div
                  className={`text-gray-700 dark:text-gray-300 ${
                    !showFullDescription ? "line-clamp-3" : ""
                  }`}
                >
                  {video.description ? (
                    <p className="whitespace-pre-wrap">{video.description}</p>
                  ) : (
                    <p className="italic text-gray-500 dark:text-gray-400">
                      No description available.
                    </p>
                  )}
                </div>
                {video.description && video.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-500 text-sm mt-2 font-medium"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CommentsSection videoId={id} />
            </motion.div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Videos
              </h3>
              <div className="space-y-4">
                {relatedVideos.slice(0, 8).map((relatedVideo) => (
                  <Link
                    key={relatedVideo._id}
                    to={`/watch/${relatedVideo._id}`}
                    className="flex space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                  >
                    <img
                      src={relatedVideo.thumbnail}
                      alt={relatedVideo.title}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {relatedVideo.owner?.fullName ||
                          relatedVideo.owner?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatViews(relatedVideo.views)} •{" "}
                        {formatDistanceToNow(new Date(relatedVideo.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWatch;
