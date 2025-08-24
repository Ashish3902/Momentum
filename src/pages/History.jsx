import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api.js";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get("/users/history"); // Make sure this endpoint exists in backend
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (history.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No videos in history</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Watch History</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {history.map((video) => (
          <div
            key={video._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <Link to={`/watch/${video._id}`}>
              <video
                src={video.videoUrl}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h2 className="font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-400">
                  {video.owner?.name || "Unknown uploader"}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
