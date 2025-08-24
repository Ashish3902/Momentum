import React, { useEffect, useState } from "react";
import API from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Videos() {
  const { logout } = useAuth();
  const [data, setData] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/videos");
        setData(JSON.stringify(res.data)?.slice(0, 200) + "…");
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Videos</h1>
          <button
            onClick={logout}
            className="rounded-xl border border-white/10 px-4 py-2 hover:border-white/20"
          >
            Logout
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <p className="text-slate-300 mb-4">
            Replace this with your real videos UI.
          </p>
          {data && (
            <pre className="text-xs text-slate-300 whitespace-pre-wrap break-words">
              {data}
            </pre>
          )}
          {err && <p className="text-sm text-red-400">{err}</p>}
        </div>
      </div>
    </div>
  );
}
