import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-gray-900 p-6 rounded-xl">
        <h1 className="text-2xl font-bold">{user.username}</h1>
        <p>Email: {user.email}</p>
        <p>Bio: {user.bio || "No bio yet"}</p>
      </div>
    </div>
  );
}
