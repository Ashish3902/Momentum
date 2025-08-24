import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../utils/api.js";

export default function Channel() {
  const { id } = useParams(); // Channel Owner ID
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const { data } = await API.get(`/users/${id}/channel`);
        setChannel(data.user);
        setVideos(data.videos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      setSubLoading(true);
      await API.post(`/users/${id}/subscribe`);
      alert("Subscribed!");
    } catch (err) {
      console.error(err);
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!channel) return <div className="p-6">Channel not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Channel Header */}
      <div className="flex items-center gap-4">
        <img
          src={channel.avatar || "https://via.placeholder.com/100"}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-gray-400">{channel.email}</p>
          <p className="text-gray-400">
            Subscribers: {channel.subscribersCount || 0}
          </p>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={subLoading}
          className="ml-auto bg-blue-500 px-4 py-2 rounded-lg text-white"
        >
          Subscribe
        </button>
      </div>

      {/* Videos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-gray-400">No videos uploaded yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {videos.map((video) => (
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
                    <h3 className="font-semibold">{video.title}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
