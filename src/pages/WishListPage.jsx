import axios from "axios";
import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router";

function WishListPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/market-mate/user/wishlist/products",
          { withCredentials: true }
        );

        setWishlist(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNavigate = (id) => {
    navigate(`/market-mate/product/details/${id}`);
  };

  const removeFromWishlist = async (id) => {
    try {
      setRemoving((prev) => ({ ...prev, [id]: true }));
      await axios.delete(
        `http://localhost:5000/market-mate/user/wishlist/products/${id}/remove`,
        { withCredentials: true }
      );
      setWishlist((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setRemoving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5000/market-mate/user/cart/${productId}/add`,
        { quantity: 1 },
        { withCredentials: true }
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading wishlist...</div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white min-h-screen p-2">
      <Header />

      <section className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Wishlist ({wishlist.length})
        </h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map((product) => {
              const discountedPrice =
                product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price;

              return (
                <div
                  key={product._id}
                  className="group bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/30 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* IMAGE */}
                  <div
                    onClick={() => handleNavigate(product._id)}
                    className="h-22 md:h-32 mb-2 shrink-0 cursor-pointer"
                  >
                    {product.image ? (
                      <img
                        src={`data:${product.image.contentType};base64,${product.image.base64}`}
                        alt={product.title}
                        className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center text-white/40 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col text-sm">
                    <h3 className="font-medium text-white line-clamp-1 mb-1">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-lg font-bold text-white">
                        ₹{Math.round(discountedPrice)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-green-400 text-xs font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* TAGS - Compact */}
                    {(product.category || product.subCategory) && (
                      <div className="flex gap-1 mb-2 -space-x-1">
                        {product.category && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/20 rounded-full text-xs whitespace-nowrap">
                            {product.category}
                          </span>
                        )}
                        {product.subCategory && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/20 rounded-full text-xs whitespace-nowrap">
                            {product.subCategory}
                          </span>
                        )}
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-auto pt-2">
                      <button
                        onClick={() => addToCart(product._id)}
                        className="flex-1 px-2 py-1.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all text-xs flex items-center justify-center gap-1"
                      >
                        <ShoppingBag size={14} />
                        Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        disabled={removing[product._id]}
                        className="p-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center"
                      >
                        <Heart
                          size={16}
                          className="text-red-400 fill-red-400"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white/70 mb-2">
              Wishlist empty
            </h2>
            <p className="text-white/50 mb-6 max-w-sm mx-auto text-sm">
              Add favorite items to save for later
            </p>

            <Link
              to="/market-mate/home"
              className="px-6 py-2 bg-linear-to-r from-white to-gray-100 text-black font-medium rounded-lg hover:from-gray-100 hover:to-white transition-all text-sm inline-flex items-center gap-1"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default WishListPage;
