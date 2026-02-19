import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/market-mate/user/account",
        {
          withCredentials: true,
        }
      );
      setUser(res.data.user);
    } catch (error) {
      setError("Failed to fetch profile");
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    navigate("/market-mate/admin/account/update");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white">
      {/* Simple Header */}
      <header className=" border-b border-gray-700 px-6 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <Link
            to="/market-mate/admin/dashboard"
            className="text-lg  text-white hover:text-gray-300 transition-colors"
          >
            ← Back to Dashboard
          </Link>

          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 bg-black/20 text-white/80 cursor-pointer font-semibold rounded-lg border border-white/30 transition-all"
          >
            Update Profile
          </button>
        </div>
      </header>

      <main className="pt-8 pb-12 px-6 max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className=" border border-gray-700 rounded-xl  space-y-6 p-8">
          {/* Avatar & Name */}
          <div className="text-center border-b border-gray-700 pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <h2 className="text-2xl font-semibold">{user?.name || "N/A"}</h2>
            <p className="text-gray-400">{user?.email || "N/A"}</p>
          </div>

          {/* Basic Info */}
          <div className="flex items-center justify-between px-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Role
              </label>
              <div className="text-lg font-semibold bg-green-900/50 border border-green-800/50 px-4 py-2 rounded-lg inline-block">
                Admin
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <div className="text-lg font-semibold bg-blue-900/50 border border-blue-800/50 px-4 py-2 rounded-lg inline-block">
                Active
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Joined
              </label>
              <div className="text-lg font-semibold bg-green-900/50 border border-green-800/50 px-4 py-2 rounded-lg inline-block">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className=" gap-4 pt-6 border-t border-gray-700">
            <div className="text-center p-4">
              <div className="text-sm">ID: {user?._id?.slice(-12)}</div>
            </div>
          </div>
        </div>

        {/* Update Button */}
      </main>
    </div>
  );
}

export default Account;
