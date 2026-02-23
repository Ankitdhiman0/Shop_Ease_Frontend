import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useScrollTrigger } from "../../utils/useScrollTrigger";

function SellerProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedCount, setDisplayedCount] = useState(20);
  const observer = useRef();

  useScrollTrigger();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/user/seller/products`);

        if (res.data?.success) {
          setProducts(res.data.products);
          setFilteredProducts(res.data.products.slice(0, 20));
          setDisplayedCount(20);
        }
      } catch (err) {
        console.error("Failed to fetch seller products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products.slice(0, displayedCount));
    } else {
      const filtered = products.filter((product) =>
        Object.values(product).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
      setFilteredProducts(filtered.slice(0, displayedCount));
    }
  }, [searchQuery, products, displayedCount]);

  // Intersection Observer for infinite scroll
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          filteredProducts.length < products.length &&
          displayedCount < products.length
        ) {
          setDisplayedCount((prev) => prev + 20);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, filteredProducts.length, products.length, displayedCount],
  );

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/product/delete/${productId}`, {
        withCredentials: true,
      });
      setProducts(products.filter((p) => p._id !== productId));
      setFilteredProducts(filteredProducts.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product");
    }
  };

  const handleUpdate = (product) => {
    navigate(`/shop-ease/seller/product/update/${product._id}`, {
      state: { product },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-2 text-white">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg text-gray-300">No products found</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <h1 className="text-3xl font-bold text-white">My Products</h1>

          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Flex Container */}
        <div className="flex flex-wrap gap-6">
          {filteredProducts.map((product, index) => (
            <div
              ref={
                filteredProducts.length === index + 1
                  ? lastProductElementRef
                  : null
              }
              key={product._id}
              className="flex-none w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.2rem)] max-w-sm backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl hover:shadow-white/20 hover:border-gray-600 transition-all duration-300 overflow-hidden group"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden p-4 shrink-0">
                <img
                  onClick={() =>
                    navigate(`/shop-ease/product/details/${product._id}`)
                  }
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjNDU0NTQ1Ii8+CjxwYXRoIGQ9Ik0xMCAxM0g4VjVIN1YxM0g1VjE1SDhWMjFIMTBDMTAgMjFIMTVWMjNIMTNDMTMgMjNIMVYyMUg0VjE1SDdWMTNIMTBaIiBmaWxsPSIjQjNCNEJDIi8+Cjwvc3ZnPgo=";
                  }}
                />
              </div>

              {/* Content - same as before */}
              <div className="p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-white line-clamp-1 pr-2 flex-1 group-hover:text-gray-200 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex gap-2 ml-2 shrink-0">
                    <button
                      onClick={() => handleUpdate(product)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-6 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.discount > 0 && (
                      <span className="px-3 py-1.5 bg-linear-to-r from-green-500/20 to-green-600/20 text-green-300 text-xs font-bold rounded-full border border-green-500/30">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium">{product.category}</span>
                    <span>•</span>
                    <span>{product.subCategory}</span>
                  </div>

                  {product.target && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs font-medium text-blue-300">
                        Target: {product.target}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-xs mb-6">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-16">Ratings:</span>
                    <span className="font-bold text-white">
                      {product.ratings || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-16">Reviews:</span>
                    <span className="font-bold text-white">
                      {product.reviews?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-16">Created:</span>
                    <span className="font-bold text-white truncate">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 w-16">Offers:</span>
                    <span className="font-bold text-white">
                      {product.offers?.length || 0}
                    </span>
                  </div>
                </div>

                {product.specs && product.specs.length > 0 && (
                  <div className="pt-6 border-t border-gray-700">
                    <h4 className="font-bold text-sm text-white uppercase tracking-wide mb-4">
                      Specs
                    </h4>
                    <div className="space-y-2 max-h-24 overflow-y-auto">
                      {product.specs.slice(0, 6).map((spec, idx) => (
                        <div key={idx} className="flex text-xs">
                          <span className="text-gray-400 w-20 font-medium shrink-0">
                            {spec.key}:
                          </span>
                          <span className="text-white font-medium truncate flex-1">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading more indicator */}
        {displayedCount < products.length && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-white">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              <p className="text-sm font-medium">Loading more products...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No products found
            </h3>
            <p className="text-sm text-gray-400">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerProducts;
