import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  FireIcon,
  ClockIcon,
  HandThumbUpIcon,
  BookmarkIcon,
  PlayIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  FireIcon as FireIconSolid,
  ClockIcon as ClockIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  PlayIcon as PlayIconSolid,
} from "@heroicons/react/24/solid";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: "Trending",
      href: "/trending",
      icon: FireIcon,
      iconSolid: FireIconSolid,
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: UserGroupIcon,
      iconSolid: UserGroupIcon,
      authRequired: true,
    },
  ];

  const libraryItems = [
    {
      name: "Library",
      href: "/library",
      icon: PlayIcon,
      iconSolid: PlayIconSolid,
      authRequired: true,
    },
    {
      name: "History",
      href: "/history",
      icon: ClockIcon,
      iconSolid: ClockIconSolid,
      authRequired: true,
    },
    {
      name: "Liked videos",
      href: "/liked",
      icon: HandThumbUpIcon,
      iconSolid: HandThumbUpIconSolid,
      authRequired: true,
    },
    {
      name: "Watch later",
      href: "/watch-later",
      icon: BookmarkIcon,
      iconSolid: BookmarkIconSolid,
      authRequired: true,
    },
  ];

  const otherItems = [
    {
      name: "Settings",
      href: "/profile",
      icon: Cog6ToothIcon,
      authRequired: true,
    },
    {
      name: "Help",
      href: "/help",
      icon: QuestionMarkCircleIcon,
    },
    {
      name: "About",
      href: "/about",
      icon: InformationCircleIcon,
    },
  ];

  const SidebarLink = ({ item, onClick }) => {
    const isActive = location.pathname === item.href;
    const Icon = isActive && item.iconSolid ? item.iconSolid : item.icon;

    if (item.authRequired && !user) {
      return null;
    }

    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <span className="font-medium truncate">{item.name}</span>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <SidebarLink
                key={item.name}
                item={item}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Library Section */}
        {user && (
          <div>
            <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Library
            </h3>
            <nav className="space-y-1">
              {libraryItems.map((item) => (
                <SidebarLink
                  key={item.name}
                  item={item}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Creator Section */}
        {user && (
          <div>
            <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Creator
            </h3>
            <nav className="space-y-1">
              <Link
                to="/studio"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname.startsWith("/studio")
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <PlayIcon className="w-6 h-6 flex-shrink-0" />
                <span className="font-medium truncate">Creator Studio</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Other Section */}
        <div>
          <nav className="space-y-1">
            {otherItems.map((item) => (
              <SidebarLink
                key={item.name}
                item={item}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="px-3 text-xs text-gray-500 dark:text-gray-400">
            © 2025 VideoTube. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-800">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
