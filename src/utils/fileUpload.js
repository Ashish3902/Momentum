// File validation utilities
export const validateVideoFile = (file) => {
  const allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/webm"];
  const maxSize = 500 * 1024 * 1024; // 500MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid video format. Allowed: mp4, avi, mov, webm");
  }

  if (file.size > maxSize) {
    throw new Error("Video file too large. Maximum size is 500MB");
  }

  return true;
};

export const validateImageFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid image format. Allowed: jpg, png, webp");
  }

  if (file.size > maxSize) {
    throw new Error("Image file too large. Maximum size is 5MB");
  }

  return true;
};

export const createFilePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};
