import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";

function Carousel() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await axios.get(`/user/carousel`);

        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarousel();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  // Skeleton Loader
  if (loading) {
    return (
      <div className="w-full mx-auto rounded-2xl overflow-hidden">
        <div className="w-full h-[25vh] md:h-[30vh] lg:h-[50vh] bg-gray-300 animate-pulse"></div>

        <div className="flex justify-center gap-2 mt-3">
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="w-full mx-auto relative overflow-hidden rounded-2xl">
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
              src={item.image}
              alt={`Carousel ${index + 1}`}
              className="w-full h-[25vh] md:h-[30vh] lg:h-[50vh] object-fill"
            />
          </a>
        ))}
      </div>

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
