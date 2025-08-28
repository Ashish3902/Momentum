// src/pages/SearchResults.jsx - COMPLETE REBUILT VERSION
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { searchAPI } from "../services/searchAPI";
import VideoGrid from "../components/video/VideoGrid";
import UserCard from "../components/user/UserCard";
import SearchBox from "../components/search/SearchBox";
import toast from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  VideoCameraIcon,
  UserIcon,
  ClockIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Search options
  const [sortBy, setSortBy] = useState("relevance");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get search query from URL
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");

  // Search function with comprehensive error handling
  const performSearch = useCallback(
    async (searchQuery, searchPage = 1, reset = false) => {
      if (!searchQuery.trim()) {
        setVideos([]);
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Searching ${activeTab} for: "${searchQuery}"`);

        let response;
        if (activeTab === "videos") {
          response = await searchAPI.searchVideos(searchQuery, {
            page: searchPage,
            limit: 12,
            sortBy,
            filter,
          });

          const newVideos = response?.data?.data?.videos || [];

          if (reset) {
            setVideos(newVideos);
          } else {
            setVideos((prev) => [...prev, ...newVideos]);
          }

          setPagination(response?.data?.data?.pagination || {});
        } else {
          response = await searchAPI.searchUsers(searchQuery, {
            page: searchPage,
            limit: 10,
          });

          const newUsers = response?.data?.data?.users || [];

          if (reset) {
            setUsers(newUsers);
          } else {
            setUsers((prev) => [...prev, ...newUsers]);
          }

          setPagination(response?.data?.data?.pagination || {});
        }

        console.log(
          `✅ Found ${
            activeTab === "videos" ? videos.length : users.length
          } results`
        );
      } catch (error) {
        console.error("Search error:", error);

        let errorMessage = "Search failed";
        if (error.response?.status === 401) {
          errorMessage = "Please log in to search";
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response?.status === 429) {
          errorMessage = "Too many search requests. Please wait.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        toast.error(errorMessage);

        if (reset) {
          setVideos([]);
          setUsers([]);
          setPagination({});
        }
      } finally {
        setLoading(false);
      }
    },
    [activeTab, sortBy, filter, navigate, videos.length, users.length]
  );

  // Search when query or options change
  useEffect(() => {
    if (query) {
      setVideos([]);
      setUsers([]);
      performSearch(query, 1, true);
    }
  }, [query, activeTab, sortBy, filter, performSearch]);

  // Handle search submission
  const handleSearch = (newQuery) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim(), page: "1" });
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      const nextPage = pagination.currentPage + 1;
      performSearch(query, nextPage, false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchParams({});
    setVideos([]);
    setUsers([]);
    setPagination({});
    setError(null);
  };

  // Filter and sort handlers
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const tabs = [
    {
      id: "videos",
      label: "Videos",
      icon: VideoCameraIcon,
      count: pagination.totalVideos,
      description: "Search video content",
    },
    {
      id: "users",
      label: "Users",
      icon: UserIcon,
      count: pagination.totalUsers,
      description: "Find content creators",
    },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: MagnifyingGlassIcon },
    { value: "date", label: "Upload Date", icon: ClockIcon },
    { value: "views", label: "View Count", icon: FireIcon },
    { value: "duration", label: "Duration", icon: ClockIcon },
  ];

  const filterOptions = [
    { value: "all", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Search Results
            </h1>

            {/* Search Box */}
            <div className="flex-1 max-w-2xl md:mx-8">
              <SearchBox
                initialQuery={query}
                onSearch={handleSearch}
                placeholder="Search videos, users..."
                autoFocus={false}
                showSuggestions={true}
              />
            </div>

            {/* Clear Search Button */}
            {query && (
              <button
                onClick={handleClearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mt-2 md:mt-0"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Search Info */}
          {query && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>Showing results for </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                "{query}"
              </span>
              {pagination.totalVideos > 0 && activeTab === "videos" && (
                <span>
                  {" "}
                  • {pagination.totalVideos.toLocaleString()} videos found
                </span>
              )}
              {pagination.totalUsers > 0 && activeTab === "users" && (
                <span>
                  {" "}
                  • {pagination.totalUsers.toLocaleString()} users found
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                        {tab.count.toLocaleString()}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Filters Section (Videos only) */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload date:
                </span>
                <select
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-red-800 dark:text-red-200 font-semibold">
                  Search Error
                </h3>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                {error}
              </p>
              <button
                onClick={() => performSearch(query, 1, true)}
                className="mt-3 text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading &&
            (activeTab === "videos"
              ? videos.length === 0
              : users.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Searching {activeTab}...
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  Finding the best results for "{query}"
                </p>
              </div>
            )}

          {/* Results Display */}
          {activeTab === "videos" ? (
            videos.length > 0 ? (
              <>
                <VideoGrid videos={videos} loading={false} listType="search" />

                {/* Load More Videos */}
                {pagination.hasNextPage && !loading && (
                  <div className="text-center mt-12">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      Load More Videos
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              !loading &&
              query && (
                <div className="text-center py-16">
                  <VideoCameraIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    No videos found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what
                    you're looking for.
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={() => handleFilterChange("all")}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Explore Videos
                    </button>
                  </div>
                </div>
              )
            )
          ) : users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((user) => (
                  <UserCard
                    key={`search-user-${user._id}`}
                    user={user}
                    showFollowButton={true}
                  />
                ))}
              </div>

              {/* Load More Users */}
              {pagination.hasNextPage && !loading && (
                <div className="text-center mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Load More Users
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            !loading &&
            query && (
              <div className="text-center py-16">
                <UserIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Try searching with different terms to find content creators.
                </p>
                <button
                  onClick={() => navigate("/creators")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Creators
                </button>
              </div>
            )
          )}

          {/* Loading More Indicator */}
          {loading &&
            (activeTab === "videos" ? videos.length > 0 : users.length > 0) && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Loading more {activeTab}...
                </span>
              </div>
            )}

          {/* No Query State */}
          {!query && !loading && (
            <div className="text-center py-16">
              <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                Start your search
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Enter keywords above to search for videos and content creators.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "React tutorial",
                  "Web development",
                  "JavaScript",
                  "Design tips",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;
