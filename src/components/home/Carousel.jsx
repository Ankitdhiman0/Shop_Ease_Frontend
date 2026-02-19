import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";

function Carousel() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await axios.get(`/market-mate/user/carousel`);

        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCarousel();
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="w-full mx-auto relative overflow-hidden rounded-2xl">
      {/* Images */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <a
            href={item.productLink}
            key={index}
            rel="noopener noreferrer"
            className="w-full shrink-0"
          >
            <img
              key={index}
              src={item.image} // Base64 or URL
              alt={`Carousel ${index + 1}`}
              className="w-full h-[25vh] md:h-[30vh] lg:h-[50vh] object-fill"
            />
          </a>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
