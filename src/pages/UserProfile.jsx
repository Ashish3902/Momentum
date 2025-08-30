// src/pages/UserProfile.jsx - Fixed Import
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineCalendar,
  AiOutlineLogout,
} from "react-icons/ai";
import { getCurrentUser, logoutUser } from "../services/auth";
import { videoAPI } from "../services/videoAPI"; // ✅ Correct import

const UserProfile = () => {
  // ... existing code ...

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const userResponse = await getCurrentUser();
      if (userResponse.data && userResponse.data.success) {
        const userData = userResponse.data.data;
        setUser(userData);

        try {
          // ✅ Use videoAPI.getUserVideos
          const videosResponse = await videoAPI.getUserVideos(userData._id);
          if (videosResponse.data && videosResponse.data.success) {
            setUserVideos(videosResponse.data.data.videos || []);
          }
        } catch (videoError) {
          console.warn("Failed to fetch user videos:", videoError);
          setUserVideos([]);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user profile");
      toast.error("Failed to load user profile");

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};

export default UserProfile;
