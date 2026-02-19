import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 w-full">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Row 1: Logo + Description (flex layout) */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8 w-full">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6 shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">M</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                MarketMate
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Your tech destination
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed lg:flex-1">
            Discover the latest electronics, mobiles & accessories at unbeatable
            prices.
          </p>
        </div>

        {/* Row 2: Quick Links, Categories, Support (flex layout) */}
        <div className="flex justify-between sm:flex-row gap-6 sm:gap-8 w-full">
          {/* Quick Links */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">
              Categories
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Mobiles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Accessories
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Laptops
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Headphones
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 tracking-tight">
              Support
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white text-xs sm:text-sm font-medium transition-colors duration-200 block hover:translate-x-1 py-1"
                >
                  Shipping
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 3: Social + Copyright + Policy links */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Social Icons */}
            <div className="flex space-x-3 sm:space-x-4 shrink-0">
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:rotate-3"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:rotate-3"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:rotate-3"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:rotate-3"
              >
                <FaYoutube />
              </a>
            </div>

            {/* Copyright + Legal links */}
            <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-6 text-[11px] sm:text-xs text-gray-500 w-full lg:w-auto">
              <p className="text-center lg:text-left shrink-0">
                &copy; 2025 MarketMate. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-end gap-3 flex-1 lg:flex-none">
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-200"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
