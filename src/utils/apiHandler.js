// Standardized API response handling
export const handleApiResponse = (response) => {
  if (response.data.success !== false) {
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  }
  throw new Error(response.data.message || "API request failed");
};

export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || "Server error occurred",
      statusCode: error.response.status,
    };
  } else if (error.request) {
    // Network error
    return {
      success: false,
      message: "Network error. Please check your connection.",
      statusCode: 0,
    };
  } else {
    // Other error
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
      statusCode: 500,
    };
  }
};
