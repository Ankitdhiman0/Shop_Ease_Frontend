import React from "react";
import CreateCarousel from "../components/admin/CreateCarousel";
import UpdateCarousel from "../components/admin/UpdateCarousel";
import ReadUsers from "../components/admin/ReadUsers";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/market-mate/user/logout", {
        withCredentials: true,
      });
      navigate("/market-mate/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <main className="min-h-screen w-full bg-black text-white">
      <header className="w-full px-8 py-5 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-xl">
        {/* Admin Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-lg font-bold text-white">A</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-wide text-white">
              Admin
            </h1>
            <p className="text-xs text-white/50 mt-0.5">Market-Mate</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          {/* Account Icon */}
          <Link
            to="/market-mate/admin/account"
            className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-white/20 group"
            title="Account"
          >
            <svg
              className="w-6 h-6 text-white/80 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>

          {/* Products Icon */}
          <Link
            to="/market-mate/admin/products"
            className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl transition-all hover:scale-110 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center group"
            title="Products"
          >
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </Link>

          {/* Logout Button - API Call */}
          <button
            onClick={handleLogout}
            className="w-12 h-12 bg-red-600/80 hover:bg-red-500/90 border border-red-500/50 rounded-xl transition-all hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-red-500/30 group"
            title="Logout"
          >
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-all"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="px-6 py-8 max-w-7xl mx-auto space-y-12">
        <CreateCarousel />
        <UpdateCarousel />
        <ReadUsers />
      </section>

      <Footer />
    </main>
  );
}

export default AdminDashboard;
