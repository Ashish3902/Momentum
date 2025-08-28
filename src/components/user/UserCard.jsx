// src/components/user/UserCard.jsx - User Card Component
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserSolid } from "@heroicons/react/24/solid";

const UserCard = ({ user, showFollowButton = true }) => {
  const navigate = useNavigate();

  if (!user) return null;

  const handleUserClick = () => {
    navigate(`/profile/${user.username}`);
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    // Add follow logic here
    console.log("Follow user:", user.username);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleUserClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
    >
      {/* User Avatar */}
      <div className="flex items-center justify-center mb-4">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={`${user.username} avatar`}
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
            user.avatar ? "hidden" : "flex"
          }`}
        >
          <UserSolid className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* User Info */}
      <div className="text-center">
        {/* Username */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {user.username}
        </h3>

        {/* Full Name */}
        {user.fullName && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
            {user.fullName}
          </p>
        )}

        {/* Email */}
        {user.email && (
          <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-500 mb-4">
            <EnvelopeIcon className="w-3 h-3 mr-1" />
            <span className="truncate max-w-[150px]">{user.email}</span>
          </div>
        )}

        {/* Stats (if available) */}
        {user.subscribersCount !== undefined && (
          <div className="flex justify-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                {user.subscribersCount || 0}
              </div>
              <div>Subscribers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-white">
                {user.videosCount || 0}
              </div>
              <div>Videos</div>
            </div>
          </div>
        )}

        {/* Follow Button */}
        {showFollowButton && (
          <button
            onClick={handleFollowClick}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <UserPlusIcon className="w-4 h-4" />
            <span>Follow</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;
