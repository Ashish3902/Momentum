import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api.js";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    api.get(`/videos/${id}`).then((res) => setVideo(res.data.video));
  }, [id]);

  if (!video) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <video src={video.videofile} controls className="w-full rounded-xl" />
      <h1 className="text-2xl font-bold mt-4">{video.title}</h1>
      <p className="text-gray-400">{video.description}</p>
    </div>
  );
}
