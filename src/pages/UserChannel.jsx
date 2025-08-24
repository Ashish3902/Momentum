import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { videoAPI } from "../services/videoAPI";
import { subscriptionAPI } from "../services/subscriptionAPI";
import { useAuth } from "../context/AuthContext";
import VideoGrid from "../components/video/VideoGrid";
import toast from "react-hot-toast";
import {
  UserPlusIcon,
  UserMinusIcon,
  PlayIcon,
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

const UserChannel = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [channelData, setChannelData] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [videoPage, setVideoPage] = useState(1);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);

  useEffect(() => {
    if (username) {
      fetchChannelData();
      fetchChannelVideos(true);
    }
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      // First get user by username (you might need to add this endpoint)
      const userResponse = await videoAPI.searchUsers(username);
      const foundUser = userResponse.data.data?.items?.find(
        (u) => u.username === username
      );

      if (!foundUser) {
        throw new Error("Channel not found");
      }

      // Get channel profile with stats
      const channelResponse = await subscriptionAPI.getChannelProfile(
        foundUser._id
      );
      setChannelData(channelResponse.data.data);

      // TODO: Check if current user is subscribed to this channel
    } catch (error) {
      console.error("Error fetching channel data:", error);
      toast.error("Failed to load channel");
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelVideos = async (reset = false) => {
    try {
      setVideosLoading(true);
      const currentPage = reset ? 1 : videoPage;

      const response = await videoAPI.getUserVideos(channelData?.channel?._id, {
        page: currentPage,
        limit: 12,
        isPublished: user?._id === channelData?.channel?._id ? undefined : true, // Show all videos if own channel
      });

      const newVideos = response.data.data?.docs || [];

      if (reset) {
        setChannelVideos(newVideos);
        setVideoPage(2);
      } else {
        setChannelVideos((prev) => [...prev, ...newVideos]);
        setVideoPage((prev) => prev + 1);
      }

      setHasMoreVideos(response.data.data?.hasNextPage || false);
    } catch (error) {
      console.error("Error fetching channel videos:", error);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    if (user._id === channelData?.channel?._id) {
      toast.error("You can't subscribe to your own channel");
      return;
    }

    try {
      setSubscribing(true);

      if (isSubscribed) {
        await subscriptionAPI.unsubscribe(channelData.channel._id);
        setIsSubscribed(false);
        toast.success("Unsubscribed successfully!");
      } else {
        await subscriptionAPI.subscribe(channelData.channel._id);
        setIsSubscribed(true);
        toast.success("Subscribed successfully!");
      }

      // Refresh channel data to update subscriber count
      fetchChannelData();
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast.error("Failed to update subscription");
    } finally {
      setSubscribing(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toString() || "0";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Channel not found
          </h2>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const { channel, stats } = channelData;
  const isOwnChannel = user?._id === channel._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt={`${channel.fullName || channel.username} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative -mt-16 sm:-mt-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={channel.avatar}
                alt={channel.fullName || channel.username}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
              {channel.isEmailVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                  <CheckBadgeIcon className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Channel Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {channel.fullName || channel.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    @{channel.username}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <UserPlusIcon className="w-4 h-4 mr-1" />
                      {formatNumber(stats.subscribers)} subscribers
                    </div>
                    <div className="flex items-center">
                      <PlayIcon className="w-4 h-4 mr-1" />
                      {formatNumber(stats.videos)} videos
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Joined{" "}
                      {formatDistanceToNow(new Date(channel.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  {/* Location */}
                  {channel.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {channel.location}
                    </div>
                  )}

                  {/* Social Links */}
                  {channel.social &&
                    Object.keys(channel.social).some(
                      (key) => channel.social[key]
                    ) && (
                      <div className="flex items-center space-x-4">
                        {channel.social.website && (
                          <a
                            href={channel.social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 transition-colors"
                          >
                            <GlobeAltIcon className="w-5 h-5" />
                          </a>
                        )}
                        {/* Add more social links as needed */}
                      </div>
                    )}
                </div>

                {/* Subscribe Button */}
                {!isOwnChannel && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubscribeToggle}
                    disabled={subscribing}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                      isSubscribed
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <UserMinusIcon className="w-5 h-5" />
                        <span>
                          {subscribing ? "Unsubscribing..." : "Subscribed"}
                        </span>
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="w-5 h-5" />
                        <span>
                          {subscribing ? "Subscribing..." : "Subscribe"}
                        </span>
                      </>
                    )}
                  </motion.button>
                )}

                {isOwnChannel && (
                  <Link
                    to="/studio"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    <span>Manage Channel</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {channel.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {channel.bio}
              </p>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {["videos", "about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8 pb-12">
          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VideoGrid
                videos={channelVideos}
                loading={videosLoading && videoPage === 1}
              />

              {/* Load More Videos */}
              {hasMoreVideos && !videosLoading && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchChannelVideos(false)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Load More Videos
                  </motion.button>
                </div>
              )}

              {/* Loading More */}
              {videosLoading && videoPage > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* No Videos */}
              {channelVideos.length === 0 && !videosLoading && (
                <div className="text-center py-12">
                  <PlayIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No videos yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnChannel
                      ? "Upload your first video to get started!"
                      : "This channel hasn't uploaded any videos yet."}
                  </p>
                  {isOwnChannel && (
                    <Link
                      to="/upload"
                      className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upload Video
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                About this channel
              </h3>

              <div className="space-y-6">
                {/* Description */}
                {channel.bio && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {channel.bio}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Channel Statistics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(stats.subscribers)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Subscribers
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(stats.videos)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Videos
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatDistanceToNow(new Date(channel.createdAt))}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Channel Age
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links */}
                {channel.social &&
                  Object.keys(channel.social).some(
                    (key) => channel.social[key]
                  ) && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Links
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(channel.social).map(
                          ([platform, url]) =>
                            url && (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-500 transition-colors"
                              >
                                <GlobeAltIcon className="w-4 h-4 mr-2" />
                                {platform.charAt(0).toUpperCase() +
                                  platform.slice(1)}
                              </a>
                            )
                        )}
                      </div>
                    </div>
                  )}

                {/* Join Date */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Joined
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(channel.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChannel;
