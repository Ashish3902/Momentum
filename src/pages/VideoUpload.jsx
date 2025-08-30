import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { videoAPI } from "../services/videoAPI";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon,
  PlayIcon,
  DocumentIcon,
  FilmIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  TagIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon,
  StarIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";

const VideoUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
    tags: "",
    isPublished: true,
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await videoAPI.getCategories();
        setCategories(
          response.data.data || [
            "General",
            "Music",
            "Gaming",
            "Education",
            "Entertainment",
            "Sports",
            "Technology",
            "Travel",
            "Food",
            "Fitness",
            "Comedy",
            "News",
            "How-to",
            "Vlog",
            "Other",
          ]
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if API fails
        setCategories([
          "General",
          "Music",
          "Gaming",
          "Education",
          "Entertainment",
          "Sports",
          "Technology",
          "Travel",
          "Food",
          "Fitness",
          "Comedy",
          "News",
          "How-to",
          "Vlog",
          "Other",
        ]);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVideoChange = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/webm",
        "video/mkv",
        "video/quicktime",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please select a valid video file (MP4, AVI, MOV, WebM, MKV)",
          { icon: "❌" }
        );
        return;
      }

      // Validate file size (500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Video file size should be less than 500MB", {
          icon: "⚠️",
        });
        return;
      }

      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      toast.success("Video file selected successfully!", { icon: "🎬" });
    }
  };

  const handleThumbnailChange = (file) => {
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP)", {
          icon: "❌",
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Thumbnail file size should be less than 5MB", {
          icon: "⚠️",
        });
        return;
      }

      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
      toast.success("Thumbnail selected!", { icon: "🖼️" });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleVideoChange(file);
      } else if (file.type.startsWith("image/")) {
        handleThumbnailChange(file);
      } else {
        toast.error("Please drop a video or image file", { icon: "📎" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!videoFile) {
      toast.error("Please select a video file", { icon: "📹" });
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a video title", { icon: "✏️" });
      return;
    }

    if (formData.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long", { icon: "✏️" });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadData = new FormData();
      uploadData.append("videoFile", videoFile);
      if (thumbnailFile) {
        uploadData.append("thumbnail", thumbnailFile);
      }
      uploadData.append("title", formData.title.trim());
      uploadData.append("description", formData.description.trim());
      uploadData.append("category", formData.category);
      uploadData.append("tags", formData.tags.trim());
      uploadData.append("isPublished", formData.isPublished);

      const response = await videoAPI.uploadVideo(
        uploadData,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      );

      toast.success("🎉 Video uploaded successfully!", {
        duration: 4000,
        icon: "🚀",
      });

      // Navigate to video page
      navigate(`/watch/${response.data.data._id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload video", {
        icon: "💥",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl mb-4"
            >
              <FilmIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-2">
              Upload New Video
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Share your creativity with the world ✨
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Video Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                  <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Video File
                </h2>
              </div>

              {!videoFile ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 scale-105"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <motion.div
                    animate={{ y: dragActive ? -10 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CloudArrowUpIcon className="mx-auto h-20 w-20 text-gray-400 mb-6" />
                    <p className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Drag and drop your video here
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      or click to browse files
                    </p>
                  </motion.div>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoChange(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <DocumentIcon className="w-6 h-6 mr-3" />
                    Choose Video File
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Supported: MP4, AVI, MOV, WebM, MKV (Max: 500MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4">
                        <PlayIcon className="w-7 h-7 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200 text-lg">
                          {videoFile.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {videoPreview && (
                    <motion.video
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={videoPreview}
                      controls
                      className="w-full max-w-lg rounded-xl shadow-lg"
                    />
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4">
                  <PhotoIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Thumbnail
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Optional)
                  </span>
                </h2>
              </div>

              {!thumbnailFile ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300"
                >
                  <PhotoIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                    Upload a custom thumbnail
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnailChange(e.target.files[0])}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PhotoIcon className="w-5 h-5 mr-2" />
                    Choose Thumbnail
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center">
                    <HeartIcon className="w-4 h-4 mr-1 text-pink-500" />
                    JPEG, PNG, WebP, GIF (Max: 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4">
                        <PhotoIcon className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-200 text-lg">
                          {thumbnailFile.name}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {(thumbnailFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {thumbnailPreview && (
                    <motion.img
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-w-sm rounded-xl shadow-lg"
                    />
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Video Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4">
                  <DocumentIcon className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Video Details
                </h2>
              </div>

              {/* Title */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg transition-all duration-300"
                  placeholder="Enter an engaging video title..."
                  maxLength={100}
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
                  <span>Make it catchy and descriptive!</span>
                  <span
                    className={
                      formData.title.length > 90 ? "text-orange-500" : ""
                    }
                  >
                    {formData.title.length}/100
                  </span>
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <DocumentIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg resize-none transition-all duration-300"
                  placeholder="Tell viewers what your video is about, what they'll learn, or what makes it special..."
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex justify-between">
                  <span>Help viewers discover your content</span>
                  <span
                    className={
                      formData.description.length > 1800
                        ? "text-orange-500"
                        : ""
                    }
                  >
                    {formData.description.length}/2000
                  </span>
                </p>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <FolderIcon className="w-4 h-4 mr-2 text-purple-500" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg transition-all duration-300"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <TagIcon className="w-4 h-4 mr-2 text-pink-500" />
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg transition-all duration-300"
                    placeholder="gaming, tutorial, funny, viral..."
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Separate tags with commas for better discoverability
                  </p>
                </div>
              </div>

              {/* Publish Settings */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                  />
                  <div className="flex items-center">
                    <RocketLaunchIcon className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Publish immediately
                    </span>
                  </div>
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-9">
                  Your video will be live and visible to everyone right after
                  upload
                </p>
              </div>
            </motion.div>

            {/* Upload Progress */}
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4"
                    >
                      <CloudArrowUpIcon className="w-5 h-5 text-blue-600" />
                    </motion.div>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Uploading your video...
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
                  Please don't close this page while uploading...
                </p>
              </motion.div>
            )}

            {/* Submit Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-end space-x-6 pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate("/")}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                disabled={uploading}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: uploading ? 1 : 1.05 }}
                whileTap={{ scale: uploading ? 1 : 0.95 }}
                type="submit"
                disabled={uploading || !videoFile}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center"
              >
                {uploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5 mr-3" />
                    Upload Video
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoUpload;
