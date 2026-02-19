import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function UserAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setFormData({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setError("");
    setSuccess("");
    if (!editing) {
      // Reset form when opening edit
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Password validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setError("Current password is required to change password");
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const res = await axios.put(
        "http://localhost:5000/market-mate/user/account/update",
        updateData,
        {
          withCredentials: true,
        }
      );

      setUser(res.data.user);
      setEditing(false);
      setSuccess("Profile updated successfully!");

      // Clear password fields
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-light animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-2">
      <Header />

      <main className="pt-20 pb-24 px-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light text-white mb-2">Account</h1>
          <p className="text-gray-400 text-lg">Profile information</p>
        </div>

        <div className="space-y-8 w-full">
          {/* Profile Info Card */}
          <div className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-light text-white">Profile</h2>
              <button
                onClick={handleEditToggle}
                className="px-8 py-3 bg-white text-black font-light rounded-2xl hover:bg-gray-200 transition-all border border-white shadow-lg whitespace-nowrap"
              >
                {editing ? "Cancel" : "Update Profile"}
              </button>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-300 text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 text-sm">
                {error}
              </div>
            )}

            {editing ? (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-light focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-light focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Current Password (required if changing password)
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-light focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-light focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 bg-black/50 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-light focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-white text-black font-light text-lg rounded-2xl hover:bg-gray-100 transition-all border border-white shadow-xl "
                >
                  Save Changes
                </button>
              </form>
            ) : (
              /* View Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Name
                  </label>
                  <div className="text-2xl font-light text-white">
                    {user?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-light text-gray-400 mb-3 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="text-lg font-medium text-white break-all">
                    {user?.email || "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rest of the page remains same */}
          <div className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-light text-white mb-8 flex items-center gap-3">
              📍 Addresses
              <Link
                to="/market-mate/user/addresses"
                className="ml-auto px-6 py-2 bg-white text-black text-sm font-light rounded-xl hover:bg-gray-200 transition-all border border-white whitespace-nowrap"
              >
                Manage
              </Link>
            </h2>

            <div className="space-y-4">
              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((address, index) => (
                  <div
                    key={address._id || index}
                    className="bg-black/40 p-6 rounded-2xl border border-white/10 hover:bg-black/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-light text-white text-lg">
                        {address.name || `Address ${index + 1}`}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-light ${
                          address.isDefault
                            ? "bg-white text-black"
                            : "bg-gray-700 text-gray-300 border border-gray-500"
                        }`}
                      >
                        {address.isDefault ? "Default" : "Saved"}
                      </span>
                    </div>
                    <div className="text-gray-300 space-y-1 text-sm">
                      <div>{address.street}</div>
                      <div>
                        {address.city}, {address.state} - {address.pincode}
                      </div>
                      <div>📞 {address.phone}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No addresses saved
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-light text-white mb-8">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/market-mate/user/orders"
                className="group flex flex-col items-center p-6 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 transition-all hover:-translate-y-2 h-full"
              >
                <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30 rounded-2xl flex items-center justify-center mb-4 border border-white/30 transition-all">
                  📦
                </div>
                <div className="text-center">
                  <div className="font-light text-white text-lg mb-1">
                    Orders
                  </div>
                  <div className="text-sm text-gray-400">Track orders</div>
                </div>
              </Link>

              <Link
                to="/market-mate/user/wishlist"
                className="group flex flex-col items-center p-6 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 transition-all hover:-translate-y-2 h-full"
              >
                <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30 rounded-2xl flex items-center justify-center mb-4 border border-white/30 transition-all">
                  💖
                </div>
                <div className="text-center">
                  <div className="font-light text-white text-lg mb-1">
                    Wishlist
                  </div>
                  <div className="text-sm text-gray-400">Saved items</div>
                </div>
              </Link>

              <Link
                to="/market-mate/user/addresses"
                className="group flex flex-col items-center p-6 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 transition-all hover:-translate-y-2 h-full"
              >
                <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30 rounded-2xl flex items-center justify-center mb-4 border border-white/30 transition-all">
                  📍
                </div>
                <div className="text-center">
                  <div className="font-light text-white text-lg mb-1">
                    Addresses
                  </div>
                  <div className="text-sm text-gray-400">Manage addresses</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserAccount;
