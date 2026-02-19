import React, { useEffect, useState, useRef } from "react";

function Notice() {
  const notices = [
    "🎉 Flash Sale: Up to 70% OFF on all electronics - ends in 24 hours!",
    "🛒 Free shipping on orders above ₹999 - limited time offer!",
    "⭐ New arrivals: Premium gadgets at unbeatable prices!",
    "💎 Clearance sale: Last chance to grab discounted luxury items!",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [notices.length]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="w-full bg-black/95 border-y border-white/20 backdrop-blur-md overflow-hidden">
      <div className="relative h-10 flex items-center justify-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-linear-to-r from-white/5 via-transparent to-white/5" />

        {/* Animated Text with Jitter Effect */}
        <div className="flex items-center h-full px-6">
          <div
            className={`text-white font-lighter text-[10px] md:text-xs tracking-wider transition-all duration-300 ${
              isTransitioning ? "jitter-effect scale-105" : "scale-100"
            }`}
          >
            {notices[currentIndex]}
          </div>
        </div>

        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-white/10 via-transparent to-white/10 opacity-50 animate-pulse" />
      </div>

      <style>{`
       
      `}</style>
    </div>
  );
}

export default Notice;
