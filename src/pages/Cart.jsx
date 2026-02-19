import React, { useEffect, useState } from "react";
import axios from "../utils/AxiosInstance";
import { ShoppingBag, Trash2, Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

function Cart() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const [addressLength, setAddressLength] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/market-mate/user/cart/products`);

        if (res.data?.products) {
          setProducts(res.data.products);
          setAddressLength(res.data.addressLength);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const removeItem = async (id) => {
    try {
      setRemoving((prev) => ({ ...prev, [id]: true }));
      await axios.delete(`/market-mate/user/cart/products/${id}/remove`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setRemoving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleNavigate = () => {
    if (addressLength > 0) {
      navigate("/market-mate/order/summary");
    } else {
      navigate("/market-mate/user/address/register");
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount ? Math.round(price * (1 - discount / 100)) : price;
  };

  const totalPrice = products.reduce((total, product) => {
    return total + calculateDiscountedPrice(product.price, product.discount);
  }, 0);

  if (loading) {
    return (
      <>
        <main className="bg-black min-h-screen p-2">
          <Header />
          <div className="h-80 flex justify-center items-center text-white">
            <div className="text-xl font-medium">Loading Cart...</div>
          </div>
          <Footer />
        </main>
      </>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white p-2">
      <Header />

      {products.length === 0 ? (
        <div className="h-64 flex flex-col justify-center items-center text-white/40 py-8">
          <ShoppingBag className="w-20 h-20 mb-4 opacity-30" />
          <h2 className="text-xl font-bold mb-1">EMPTY CART</h2>
          <p className="text-sm">Start shopping</p>
        </div>
      ) : (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4 mb-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-black/30 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Image */}
                  {product.image && (
                    <div className="w-30 h-30 bg-white/5 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={`data:${product.image.contentType};base64,${product.image.base64}`}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-md line-clamp-1 mb-1">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-white">
                        ₹
                        {calculateDiscountedPrice(
                          product.price,
                          product.discount,
                        ).toLocaleString()}
                      </span>
                      {product.discount && (
                        <span className="text-sm text-white/50 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.averageRating && (
                      <div className="flex items-center gap-1 mb-2 text-xs text-white/60">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.round(product.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                        <span>{product.averageRating}</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3 text-xs">
                      {product.category && (
                        <span className="px-2 py-1 bg-white/10 rounded-full">
                          {product.category}
                        </span>
                      )}
                      {product.target && (
                        <span className="px-2 py-1 bg-white/5 rounded-full text-white/60">
                          {product.target}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(product._id)}
                      disabled={removing[product._id]}
                      className="flex items-center hover:bg-red-600 transition-all ease-in duration-150 cursor-pointer gap-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-sm font-medium text-white/70"
                    >
                      {removing[product._id] ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({products.length} items)</span>
                <span className="font-semibold">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleNavigate}
              className="w-full cursor-pointer bg-linear-to-r from-white/20 to-white/50 text-black font-bold py-3 px-6 rounded-xl text-lg"
            >
              <ShoppingBag className="w-5 h-5 inline mr-2" />
              Proceed to Checkout
            </button>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export default Cart;
