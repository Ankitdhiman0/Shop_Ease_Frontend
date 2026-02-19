import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function DiscountedItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/market-mate/product/filter?discounted=true`,
        );

        if (res.data.success) {
          const discounted = res.data.products.slice(0, 5).map((product) => ({
            ...product,
            imageSrc: product.image?.base64
              ? `data:${product.image.contentType};base64,${product.image.base64}`
              : null,
            finalPrice: product.price - product.discount,
          }));

          setItems(discounted);
        }
      } catch (err) {
        console.error("Failed to fetch discounted products", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  if (!items.length) {
    return (
      <div className="h-full w-full flex flex-col overflow-hidden rounded-xl">
        {/* Compact Header Skeleton */}
        <div className="px-4 py-3 border-b border-white/20 animate-pulse">
          <div className="h-6 w-24 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mb-1 mx-auto" />
          <div className="h-3 w-20 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded mx-auto" />
        </div>

        {/* Carousel Skeleton - Full Height */}
        <div className="flex-1 relative overflow-hidden">
          <div className="flex h-full">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-full shrink-0 relative animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="w-full h-[25vh] pt-4 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded-b-2xl" />

                {/* Price Card Skeleton */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-2xl h-32 flex flex-col justify-between">
                    {/* Discount Badge Skeleton */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-5 bg-linear-to-r from-white/20 via-white/40 to-white/20 rounded-xl" />
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-4 w-3/4 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mb-3" />

                    {/* Price Skeleton */}
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <div className="h-6 w-20 bg-linear-to-r from-green-400/30 via-green-400/50 to-green-400/30 rounded" />
                        <div className="h-3 w-16 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
                      </div>
                      <div className="h-3 w-24 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full border border-white/30 animate-pulse hidden md:block" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full border border-white/30 animate-pulse hidden md:block" />
        </div>

        {/* Dots Skeleton */}
        <div className="px-4 py-2 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full bg-linear-to-r from-white/20 via-white/40 to-white/20 animate-pulse ${
                i === 2 ? "w-6 shadow-md bg-white/60" : ""
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-white/20">
        <h2 className="text-lg font-bold text-white tracking-tight text-center">
          Discounted
        </h2>
        <p className="text-xs text-white/70 text-center">Limited offers</p>
      </div>

      {/* Carousel - Full Height */}
      <div className="flex-1 relative overflow-hidden rounded-b-2xl">
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              onClick={() =>
                navigate(`/market-mate/product/details/${item._id}`)
              }
              key={index}
              className="w-full shrink-0 relative"
            >
              {item.imageSrc && (
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-[25vh] pt-4 object-contain"
                />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />

              {/* Compact Price Card */}
              <div className="absolute bottom-2 left-4 right-4">
                <div className="bg-black/95 backdrop-blur-sm border border-white/30 rounded-2xl px-2 p-1 shadow-2xl max-h-32">
                  {/* Discount Badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-linear-to-r from-gray-200 to-white text-black text-xs font-bold px-3 py-1 rounded-xl shadow-lg whitespace-nowrap">
                      -{item.discount}%
                    </span>
                  </div>

                  <div className="text-white pt-2 space-y-1">
                    <h3 className="text-sm font-bold line-clamp-1 leading-tight">
                      {item.title}
                    </h3>

                    <div className="space-y-px">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm font-black">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(
                            item.price - (item.price * item.discount) / 100,
                          )}
                        </span>
                        <span className="text-xs line-through opacity-70">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          }).format(item.price)}
                        </span>
                      </div>
                      <div className="text-xs opacity-75">
                        Save{" "}
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format((item.price * item.discount) / 100)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Navigation */}
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full border border-white/30 items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110 hidden md:flex"
        >
          ‹
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-full border border-white/30 items-center justify-center text-white font-bold text-lg transition-all duration-300 hover:scale-110 hidden md:flex"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="px-4 py-2 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-white w-6 shadow-md"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default DiscountedItems;
