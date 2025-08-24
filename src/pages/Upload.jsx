import { useState } from "react";
import api from "../lib/api.js";

export default function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    file: null,
    thumbnail: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("videofile", form.file);
    fd.append("thumbnail", form.thumbnail);
    await api.post("/videos/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Uploaded!");
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl w-96 space-y-3"
      >
        <h2 className="text-xl font-bold text-center">Upload Video</h2>
        <input
          name="title"
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-800"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-800"
          onChange={handleChange}
        ></textarea>
        <input
          name="file"
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <input
          name="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 bg-gray-800 rounded"
        />
        <button className="bg-sky-500 hover:bg-sky-600 w-full py-2 rounded-lg">
          Upload
        </button>
      </form>
    </div>
  );
}
