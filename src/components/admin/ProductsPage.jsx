import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "../../utils/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    fetchProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async (reset = false) => {
    try {
      if (reset) {
        setPage(1);
        setProducts([]);
        setHasMore(true);
      }

      setIsLoadingMore(true);
      const params = {
        page: reset ? 1 : page,
        limit: 20,
        ...(searchQuery && { search: searchQuery }), // Server-side search
      };

      const res = await axios.get(
        `/user/admin/products`, // Fixed API path
        {
          params,
        },
      );

      const newProducts = res.data.products || [];
      setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));
      setHasMore(res.data.hasMore || newProducts.length === 20);
      setPage(res.data.page || page);
    } catch (error) {
      setError("Failed to fetch products");
      console.error("Fetch products error:", error.response?.data || error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Reset on search change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(true);
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const lastProductElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setPage((prev) => prev + 1);
          fetchProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasMore, isLoadingMore, page],
  );

  const handleRefresh = () => {
    fetchProducts(true);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1
              onClick={() => navigate("/market-mate/admin/dashboard")}
              className=" flex items-center text-2xl font-bold"
            >
              <ArrowBigLeft /> Home
            </h1>
            <p className="text-gray-400">
              Manage all products ({products.length})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-all"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="pt-6 px-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              ref={index === products.length - 1 ? lastProductElementRef : null}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl transition-all hover:shadow-2xl"
            >
              {/* Product Image - FIXED */}
              <div className="mb-4">
                {product.image && product.image.base64 ? (
                  <img
                    src={`data:${
                      product.image.contentType || "image/jpeg"
                    };base64,${product.image.base64}`}
                    alt={product.title}
                    className="w-full h-32 object-contain rounded-xl group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      console.log("Image error:", product.image);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xl font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-400 capitalize">
                  {product.category}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-white">
                    ₹{product.price?.toLocaleString() || "N/A"}
                  </span>
                  {product.discount && (
                    <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoadingMore && (
          <div className="text-center py-12">
            <div className="text-lg text-gray-400 animate-pulse">
              Loading more products...
            </div>
          </div>
        )}

        {products.length === 0 && !loading && !isLoadingMore && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-4L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {searchQuery ? "No products found" : "No products available"}
            </h3>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductsPage;
