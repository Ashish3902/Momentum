// src/utils/testWatchLater.js - For testing purposes
import { libraryAPI } from "../services/libraryAPI";

export const addTestVideosToWatchLater = async () => {
  const testVideoIds = [
    "67558d6ff34e53bdc97d0a1a", // Replace with actual video IDs from your database
    "67558d6ff34e53bdc97d0a1b",
    "67558d6ff34e53bdc97d0a1c",
  ];

  for (const videoId of testVideoIds) {
    try {
      await libraryAPI.addToWatchLater(videoId);
      console.log(`Added video ${videoId} to watch later`);
    } catch (error) {
      console.error(`Failed to add ${videoId}:`, error);
    }
  }
};

// Call this in browser console to test:
// addTestVideosToWatchLater();
