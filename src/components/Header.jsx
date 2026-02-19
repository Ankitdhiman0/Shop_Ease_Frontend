import React, { useState } from "react";
import {
  Search,
  User,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Crown,
  Menu,
  X,
  MapPin,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

function Header() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/market-mate/search?query=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const handleLogout = async () => {
    try {
      await axios.get(`/market-mate/user/logout`);
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/market-mate/login", { replace: true });
  };

  const handleRedirect = () => {
    if (user?.isSeller) {
      navigate("/market-mate/seller/dashboard");
    } else {
      navigate("/market-mate/seller/description");
    }
  };

  const handleWishlist = () => {
    navigate("/market-mate/user/wishlist");
    setMobileOpen(false);
  };

  return (
    <>
      <header className="w-full border border-white/20 backdrop-blur-xl px-6 py-3 flex items-center justify-between gap-4 rounded-3xl">
        {/* Logo + Search */}
        <div className="flex items-center gap-4 flex-1">
          <h1
            onClick={() => navigate("/market-mate/home")}
            className="text-white cursor-pointer text-lg leading-none tracking-wider"
          >
            Market
            <br />
            Mate
          </h1>

          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            title="wishlist"
            onClick={handleWishlist}
            className="relative p-2 hover:bg-white/20 text-white/70 rounded-full"
          >
            <Heart size={20} />
          </button>
          <button
            title="Orders"
            onClick={() => navigate("/market-mate/user/orders")}
            className="p-2 hover:bg-white/20 text-white/70 rounded-full"
          >
            <ShoppingBag />
          </button>
          <button
            title="cart"
            onClick={() => navigate("/market-mate/user/cart")}
            className="p-2 hover:bg-white/20 text-white/70 rounded-full"
          >
            <ShoppingCart />
          </button>
          <button
            onClick={() => navigate("/market-mate/account")}
            title="account"
            className="px-3 py-2 text-xs flex gap-2 text-white/70 hover:bg-white/20 rounded-full"
          >
            <User size={18} />
          </button>
          <button
            title="manage addresses"
            onClick={() => navigate("/market-mate/user/addresses")}
            className="px-3 py-2 text-xs flex gap-2 text-white/70 hover:bg-white/20 rounded-full items-center"
          >
            <MapPin />
          </button>
          <button
            onClick={handleRedirect}
            className="px-3 py-2 text-xs flex gap-2 text-white/70 hover:bg-yellow-600/20 rounded-full"
          >
            <Crown size={16} className="text-yellow-400" />
            Sell
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs flex gap-2 hover:bg-red-600/20 rounded-full text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile menu */}
        <button
          className="lg:hidden p-2 hover:bg-white/20 rounded-full text-white/70"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 ${
          mobileOpen ? "block" : "hidden"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-3/5 max-w-sm bg-black/50 z-50 p-6 transform ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } transition`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 text-white right-4"
        >
          <X />
        </button>

        <div className="mt-16 flex flex-col gap-4">
          <button
            onClick={handleWishlist}
            className="flex gap-3 text-white p-3 hover:bg-white/10 rounded-xl relative"
          >
            <Heart />
            Wishlist
          </button>
          <button
            onClick={() => navigate("/market-mate/account")}
            className="flex gap-3 text-white p-3 hover:bg-white/10 rounded-xl relative"
          >
            <User />
            Account
          </button>
          <button
            onClick={() => navigate("/market-mate/user/orders")}
            className="flex gap-3 text-white p-3 hover:bg-white/10 rounded-xl"
          >
            <ShoppingBag /> Bag
          </button>
          <button
            onClick={() => navigate("/market-mate/user/cart")}
            className="flex gap-3 text-white p-3 hover:bg-white/10 rounded-xl"
          >
            <ShoppingCart /> Cart
          </button>
          <button
            onClick={() => navigate("/market-mate/user/addresses")}
            className="flex gap-1 p-3 text-sm  hover:bg-white/10 rounded-xl text-white"
          >
            <MapPin />
            Manage Addresses
          </button>
          <button
            onClick={handleRedirect}
            className="flex gap-3 p-3 text-white hover:bg-yellow-600/20 rounded-xl"
          >
            <Crown className="text-yellow-400" /> Sell
          </button>
          <button
            onClick={handleLogout}
            className="flex gap-3 p-3 hover:bg-red-600/20 rounded-xl text-red-500"
          >
            <LogOut /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
