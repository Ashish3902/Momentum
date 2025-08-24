import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoWatch from "./pages/VideoWatch";
import VideoUpload from "./pages/VideoUpload";
import SearchResults from "./pages/SearchResults";
import UserChannel from "./pages/UserChannel";
import UserProfile from "./pages/UserProfile";
import CreatorStudio from "./pages/CreatorStudio";

// Placeholder pages for remaining routes
const TrendingPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Trending Videos
      </h1>
      <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
    </div>
  </div>
);

const SubscriptionsPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your Subscriptions
      </h1>
      <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
    </div>
  </div>
);

const LibraryPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Your Library
      </h1>
      <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
    </div>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />

            {/* Main Content */}
            <div className="lg:pl-64">
              <main className="min-h-[calc(100vh-4rem)]">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/watch/:id" element={<VideoWatch />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/channel/:username" element={<UserChannel />} />
                  <Route path="/trending" element={<TrendingPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/upload"
                    element={
                      <ProtectedRoute>
                        <VideoUpload />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/studio/*"
                    element={
                      <ProtectedRoute>
                        <CreatorStudio />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscriptions"
                    element={
                      <ProtectedRoute>
                        <SubscriptionsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/library"
                    element={
                      <ProtectedRoute>
                        <LibraryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Page */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            404
                          </h1>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Page not found
                          </p>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "var(--toast-bg)",
                  color: "var(--toast-color)",
                },
                success: {
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
