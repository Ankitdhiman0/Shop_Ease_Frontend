import React, { useState, useEffect } from "react";
import axios from "../../utils/AxiosInstance";
import { Link } from "react-router-dom";

function ReadUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/market-mate/user/admin/users`);
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-20 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">All Users</h1>
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-sm font-medium transition-all self-start lg:self-auto"
            >
              🔄 Refresh
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-400 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-xl text-md"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Users Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
            >
              {/* User Avatar & Name */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shrin k-0 shadow-lg">
                  <span className="text-md font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate mb-1 group-hover:text-purple-300 transition-colors">
                    {user.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Full Addresses Section */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                  📍 Addresses ({user.addresses?.length || 0})
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {user.addresses?.length > 0 ? (
                    user.addresses.map((address, idx) => (
                      <div
                        key={address._id || idx}
                        className="group/address bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-all hover:shadow-md hover:shadow-white/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-semibold text-white text-sm truncate max-w-50">
                            {address.name || `Address ${idx + 1}`}
                          </div>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 text-xs text-gray-300 leading-tight">
                          <div>{address.street}</div>
                          <div className="flex gap-2">
                            <span>{address.city}</span>
                            <span>{address.state}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span>Pin: {address.pincode}</span>
                            <span className="text-gray-500">
                              📞 {address.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
                      No addresses added
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/market-mate/admin/users/${user._id}/orders`}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl transition-all group-hover:shadow-xl shadow-purple-500/30 h-12"
              >
                📦 View Orders
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {searchQuery ? "No matching users" : "No users found"}
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? `No users found for "${searchQuery}"`
                : "No registered users yet."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReadUsers;
