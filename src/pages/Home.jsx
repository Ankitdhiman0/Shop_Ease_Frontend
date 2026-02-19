import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Carousel from "../components/home/Carousel";
import DiscountedItems from "../components/home/DiscountedItems";
import Notice from "../components/home/Notice";
import ExplorePopularCategories from "../components/home/ExplorePopularCategories";
import MobilesProducts from "../components/home/MobilesProducts";
import ElectronicsAccessories from "../components/home/ElectronicsAccessories";
import Footer from "../components/Footer";
import WomenClothes from "../components/home/WomenClothes";
import MenTshirts from "../components/home/MenTshirts";
import HomeKitchen from "../components/home/HomeKitchen";
import { useScrollTrigger } from "../utils/useScrollTrigger";

function Home() {
  const [loading, setLoading] = useState(true);

  useScrollTrigger();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-black px-2 py-4 flex flex-col gap-5">
        <Header />

        {/* Hero Section Skeleton */}
        <section className="w-full flex h-[30vh] md:h-[50vh] lg:h-[60vh] flex-col md:flex-row items-center justify-center gap-4 animate-pulse">
          <div className="border border-white/20 h-full w-full md:w-[30vw] rounded-2xl bg-linear-to-r from-white/10 via-white/20 to-white/10 hidden md:block" />
          <div className="w-full md:w-[70vw] h-full bg-linear-to-r from-white/5 via-white/15 to-white/5 rounded-2xl" />
        </section>

        {/* Notice Skeleton */}
        <div className="h-16 bg-white/10 rounded-xl border border-white/20" />

        {/* Categories Skeleton */}
        <div className="h-24 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded-xl flex items-center px-6">
          <div className="h-10 w-48 bg-white/20 rounded-lg" />
        </div>

        {/* Product Sections Skeletons */}
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-4">
              {/* Section Title */}
              <div className="h-8 w-64 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded-lg" />

              {/* Horizontal Scroll Skeleton */}
              <div className="flex gap-4 overflow-hidden scrollbar-hide">
                {[...Array(6)].map((_, j) => (
                  <div
                    key={j}
                    className="min-w-48 h-48 rounded-xl bg-linear-to-r from-white/10 via-white/20 to-white/10 border border-white/20 shrink-0"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Space */}
        <div className="h-20" />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black px-2 py-4 flex flex-col gap-5">
      <Header />

      {/* Hero Section */}
      <section className="w-full flex auto  md:h-[30vh] lg:h-[50vh] flex-col md:flex-row items-center justify-center gap-4">
        <div className="border border-white/40 h-full w-full md:w-[30vw] rounded-2xl hidden md:flex">
          <DiscountedItems />
        </div>
        <div className="w-full md:w-[70vw] h-full">
          <Carousel />
        </div>
      </section>

      {/* Quick Sections */}
      <Notice />
      <ExplorePopularCategories />

      {/* Product Categories */}
      <div className="space-y-8">
        <MobilesProducts />
        <ElectronicsAccessories />
        <WomenClothes />
        <MenTshirts />
        <HomeKitchen />
      </div>

      <Footer />
    </main>
  );
}

export default Home;
