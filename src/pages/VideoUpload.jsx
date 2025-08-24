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
} from "@heroicons/react/24/outline";

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await videoAPI.getCategories();
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Please select a valid video file (MP4, AVI, MOV, WebM, MKV)"
        );
        return;
      }

      // Validate file size (500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error("Video file size should be less than 500MB");
        return;
      }

      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
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
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, WebP)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Thumbnail file size should be less than 5MB");
        return;
      }

      setThumbnailFile(file);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
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
      const file = e.dataTransfer.files;
      if (file.type.startsWith("video/")) {
        handleVideoChange(file);
      } else if (file.type.startsWith("image/")) {
        handleThumbnailChange(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a video title");
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
      uploadData.append("tags", formData.tags);
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

      toast.success("Video uploaded successfully!");
      navigate(`/watch/${response.data.data._id}`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload video");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Upload New Video
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Video Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Video File
              </h2>

              {!videoFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoChange(e.target.files[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    Choose Video File
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Supported formats: MP4, AVI, MOV, WebM, MKV (Max: 500MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <PlayIcon className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          {videoFile.name}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-w-md rounded-lg shadow-md"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Thumbnail (Optional)
              </h2>

              {!thumbnailFile ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
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
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <PhotoIcon className="w-4 h-4 mr-2" />
                    Choose Thumbnail
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    JPEG, PNG, WebP (Max: 5MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center">
                      <PhotoIcon className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-800 dark:text-blue-200">
                          {thumbnailFile.name}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {(thumbnailFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview(null);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full max-w-sm rounded-lg shadow-md"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Video Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Video Details
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter video title"
                  maxLength={100}
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Tell viewers about your video"
                  maxLength={2000}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/2000 characters
                </p>
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate tags with commas
                  </p>
                </div>
              </div>

              {/* Publish Settings */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Publish immediately
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploading...
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: uploading ? 1 : 1.02 }}
                whileTap={{ scale: uploading ? 1 : 0.98 }}
                type="submit"
                disabled={uploading || !videoFile}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoUpload;
