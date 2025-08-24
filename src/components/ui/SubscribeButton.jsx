// src/components/ui/SubscribeButton.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { subscriptionAPI } from "../../services/subscriptionAPI";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

const SubscribeButton = ({
  channelId,
  initialSubscribed = false,
  initialCount = 0,
}) => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [subscriberCount, setSubscriberCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleSubscribeToggle = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    if (user._id === channelId) {
      toast.error("You can't subscribe to your own channel");
      return;
    }

    console.log("Attempting to toggle subscription for channel:", channelId);

    try {
      setLoading(true);
      const response = await subscriptionAPI.toggleSubscription(channelId);
      console.log("Subscription response:", response.data);

      if (response.data?.success !== false) {
        const newIsSubscribed = response.data.data.isSubscribed;
        const newCount = response.data.data.subscriberCount;

        setIsSubscribed(newIsSubscribed);
        setSubscriberCount(newCount);

        toast.success(
          newIsSubscribed
            ? "Subscribed successfully!"
            : "Unsubscribed successfully!"
        );
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSubscribeToggle}
      disabled={loading}
      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
        isSubscribed
          ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          : "bg-red-600 text-white hover:bg-red-700"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        <>
          {isSubscribed ? (
            <UserMinusIcon className="w-5 h-5" />
          ) : (
            <UserPlusIcon className="w-5 h-5" />
          )}
          <span>{isSubscribed ? "Subscribed" : "Subscribe"}</span>
          {subscriberCount > 0 && (
            <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {subscriberCount}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};

export default SubscribeButton;
