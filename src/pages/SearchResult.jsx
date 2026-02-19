import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useSearchParams } from "react-router";
import axios from "../utils/AxiosInstance";
import { useScrollTrigger } from "../utils/useScrollTrigger";

function SearchResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useScrollTrigger();

  // Filter states
  const [targetFilter, setTargetFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `/market-mate/product/search?query=${query}`,
        );

        setProducts(res.data || []);
        // Detect category from first product
        if (res.data?.length > 0) {
          setCategory(res.data[0].category?.toLowerCase() || "all");
        }
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  const handleNavigate = (id) => {
    navigate(`/market-mate/product/details/${id}`);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Target filter
      if (targetFilter !== "all" && product.target !== targetFilter) {
        return false;
      }

      // Max price filter
      if (maxPrice && product.price > parseInt(maxPrice)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else if (sortOrder === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-black text-white flex flex-col">
        <Header />

        {/* Filter Section */}
        <section className="w-full bg-linear-to-r from-black/90 via-black/70 to-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 animate-pulse h-20"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Products Section - Wireframe Grid */}
        <section className="flex-1 max-w-7xl mx-auto p-4 md:p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="group relative bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 animate-pulse hover:bg-white/5 transition-all duration-300 hover:shadow-xl shadow-black/50 overflow-hidden h-64 md:h-72 flex flex-col"
              >
                {/* Image Skeleton */}
                <div className="w-full h-24 md:h-28 rounded-lg overflow-hidden mb-3 bg-linear-to-r from-white/10 via-white/20 to-white/10" />

                {/* Title Skeleton */}
                <div className="h-5 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded mb-2 w-3/4" />
                <div className="h-4 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded w-1/2 mb-3" />

                {/* Price Skeleton */}
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="h-7 w-16 bg-linear-to-r from-green-400/30 via-green-400/50 to-green-400/30 rounded" />
                  <div className="h-4 w-20 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded" />
                </div>

                {/* Target & Offers Skeleton */}
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-1 mb-2 h-4 w-20 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded" />
                  <div className="space-y-1">
                    <div className="h-6 bg-white/5 rounded p-1" />
                    <div className="h-6 bg-white/5 rounded p-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black text-white flex flex-col p-2">
      <Header />

      {/* Filter Section - FULL WIDTH NEW UI */}
      <section className="w-full bg-linear-to-r from-black/90 via-black/70 to-black/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Target Filter */}
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:border-white/40 transition-all duration-300">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Target Audience
              </label>
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 hover:bg-black/20"
              >
                <option value="all">All Targets</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:border-white/40 transition-all duration-300">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Max Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="₹50,000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-black/30 border border-white/30 rounded-xl px-12 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 hover:bg-black/20 pr-4"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  ₹
                </span>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 hover:border-white/40 transition-all duration-300 md:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Sort By
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 hover:bg-black/20"
              >
                <option value="default">Recommended</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters & Results */}
            <div className="md:col-span-2 lg:col-span-1 flex gap-3 md:gap-4 items-center justify-between ">
              <button
                onClick={() => {
                  setTargetFilter("all");
                  setMaxPrice("");
                  setSortOrder("default");
                }}
                className="text-sm text-gray-400 hover:text-white font-medium  py-2 hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear All
              </button>
              <div className="text-sm  text-white">
                {filteredProducts.length} of {products.length} results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="flex-1 max-w-7xl mx-auto p-4 md:p-6 mb-6">
        {query && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">"{query}"</h1>
            <p className="text-gray-400 text-sm">
              {filteredProducts.length} results
            </p>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 flex-1 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const hasValidImage = product.image?.base64;
              const hasTarget = product.target;
              const hasOffers = product.offers?.length > 0;
              const discountPercent = product.discount || 0;
              const firstTwoOffers = hasOffers
                ? product.offers.slice(0, 2)
                : [];

              return (
                <div
                  onClick={() => handleNavigate(product._id)}
                  key={product._id}
                  className="group relative bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 hover:bg-white/5 transition-all duration-300  hover:shadow-xl shadow-black/50 overflow-hidden "
                >
                  {/* Image */}
                  {hasValidImage ? (
                    <div className="w-full h-24 md:h-28 rounded-lg overflow-hidden mb-3 bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                      <img
                        src={`data:${product.image.contentType};base64,${product.image.base64}`}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 md:h-28 rounded-lg overflow-hidden mb-3 bg-white/10 flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-sm md:text-base font-bold line-clamp-2 mb-2 leading-tight">
                    {product.title}
                  </h3>

                  {/* Price & Discount */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg md:text-xl font-black text-green-400">
                      ₹
                      {Math.round(
                        product.price - product.price * (discountPercent / 100),
                      ).toLocaleString()}
                    </span>
                    {discountPercent > 0 && (
                      <>
                        <span className="text-xs md:text-sm line-through text-gray-400">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <span className="hidden lg:flex text-xs md:text-xs border border-white/20 text-white px-2 py-0.5 rounded ">
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Target */}
                  {hasTarget && (
                    <div className="flex items-center gap-1 mb-2 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="truncate">{product.target}</span>
                    </div>
                  )}

                  {/* Offers */}
                  {hasOffers && firstTwoOffers.length > 0 && (
                    <div className="space-y-1 mt-auto">
                      {firstTwoOffers.map((offer) => (
                        <div
                          key={offer._id}
                          className="flex items-center justify-between text-xs p-1 bg-white/5 rounded"
                        >
                          <span className="truncate text-gray-300">
                            {offer.title}
                          </span>
                          {offer.discount && (
                            <span className="font-semibold text-green-400 text-xs">
                              ₹{offer.discount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default SearchResult;
