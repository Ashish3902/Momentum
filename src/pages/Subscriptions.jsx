import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    // Dummy data for now
    setSubscriptions([
      {
        _id: "1",
        name: "Nature Wonders",
        avatar: "https://source.unsplash.com/100x100/?nature,forest",
        subscribersCount: 2500,
      },
      {
        _id: "2",
        name: "Tech Reviews",
        avatar: "https://source.unsplash.com/100x100/?technology,gadget",
        subscribersCount: 4800,
      },
      {
        _id: "3",
        name: "Travel Vlogs",
        avatar: "https://source.unsplash.com/100x100/?travel,beach",
        subscribersCount: 3600,
      },
    ]);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p className="text-gray-400">
          You haven’t subscribed to any channels yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {subscriptions.map((channel) => (
            <div
              key={channel._id}
              className="bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col items-center"
            >
              <img
                src={channel.avatar}
                alt={channel.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
              />
              <h2 className="mt-4 text-lg font-semibold">{channel.name}</h2>
              <p className="text-gray-400 text-sm">
                {channel.subscribersCount.toLocaleString()} subscribers
              </p>
              <Link
                to={`/channel/${channel._id}`}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                View Channel
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
