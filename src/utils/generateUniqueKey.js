// src/utils/generateUniqueKey.js - Utility for generating unique keys
export const generateUniqueKey = (item, index, context = "default") => {
  // Method 1: Use existing ID with context and index
  if (item._id || item.id) {
    return `${context}-${item._id || item.id}-${index}`;
  }

  // Method 2: Generate from content hash (for truly unique keys)
  const contentHash = btoa(`${item.title}-${item.createdAt}-${index}`).slice(
    0,
    10
  );
  return `${context}-${contentHash}-${index}`;
};
