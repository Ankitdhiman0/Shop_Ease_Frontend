import axios from "../utils/AxiosInstance";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  MapPin,
  User,
  Truck,
  CreditCard,
  CheckCircle,
  Star,
  Tag,
  CreditCardIcon,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function OrderSummary() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [gstAmount, setGstAmount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/market-mate/user/account`);
        if (res.data?.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("User fetch error:", error.response?.data || error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchCart = async () => {
      try {
        const res = await axios.get(`/market-mate/user/cart/products`);
        setCart(res.data.products || []);
      } catch (error) {
        console.error("Cart fetch error:", error.response?.data || error);
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    fetchUser();
    fetchCart();
  }, []);

  // Fixed GST calculation
  const subtotal = cart.reduce((total, item) => {
    const discount = item.discount || 0;
    return total + item.price * (1 - discount / 100);
  }, 0);

  const gstRate = 0.09;
  const calculatedGst = subtotal * gstRate;
  const calculatedFinalTotal = subtotal + calculatedGst;

  useEffect(() => {
    setGstAmount(calculatedGst);
    setFinalTotal(calculatedFinalTotal);
  }, [cart, calculatedFinalTotal, calculatedGst]);

  const defaultAddress = user?.addresses?.find((addr) => addr.isDefault);

  const handlePlaceOrder = async () => {
    try {
      setOrderPlaced(true);

      const response = await axios.post(`/market-mate/user/order/create`, {
        paymentMethod,
        totalAmount: calculatedFinalTotal,
      });

      // Show success popup
      setOrderNumber(response.data.orderNumber);
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);

      navigate("/market-mate/user/orders");
    } catch (error) {
      console.error("Order error:", error.response?.data);
      alert(error.response?.data?.message || "Order placement failed");
    } finally {
      setOrderPlaced(false);
      setShowPaymentForm(false);
    }
  };

  const openPaymentForm = () => setShowPaymentForm(true);
  const closePaymentForm = () => setShowPaymentForm(false);

  if (loading || cartLoading) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Header />
        <div className="h-96 flex justify-center items-center">
          <div className="text-lg font-medium animate-pulse">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Header />
        <div className="h-96 flex flex-col justify-center items-center text-white/40">
          <User className="w-16 h-16 mb-4 opacity-30" />
          <h2 className="text-lg font-bold mb-2">No Account</h2>
          <p className="text-sm">Please log in</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <main className="bg-black min-h-screen text-white">
        <Header />
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-white/10 border border-white/20 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Order Summary</h1>
              <p className="text-white/60 text-sm">Review & Confirm</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items - Compact */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span className="font-semibold">
                    {user.name || "Customer"}
                  </span>
                  <span className="text-white/60">{user.email}</span>
                </div>
              </div>

              <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Items ({cart.length})
                </h3>
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Cart empty</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => {
                      const finalPrice =
                        item.price * (1 - (item.discount || 0) / 100);
                      return (
                        <div
                          key={item._id}
                          className="flex items-start gap-3 p-3 bg-black/10 rounded-xl"
                        >
                          {item.image && (
                            <div className="w-20 h-20 bg-white/10 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={`data:${item.image.contentType};base64,${item.image.base64}`}
                                alt={item.title}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm line-clamp-1 mb-1">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-bold text-emerald-400">
                                ₹{Math.round(finalPrice).toLocaleString()}
                              </span>
                              {item.discount && (
                                <span className="text-white/50 line-through">
                                  ₹{item.price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Compact Checkout */}
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Address - Compact */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  Delivery
                </h4>
                {defaultAddress ? (
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">{defaultAddress.street}</p>
                    <p>
                      {defaultAddress.city}, {defaultAddress.state}
                    </p>
                    <p className="text-white/60">{defaultAddress.pincode}</p>
                  </div>
                ) : (
                  <div className="text-xs text-white/40 text-center py-4">
                    <AlertCircle className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    No address
                  </div>
                )}
              </div>

              {/* Price - Compact */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                <h4 className="text-sm font-bold mb-4">Price</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length})</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>GST 18%</span>
                    <span>+₹{gstAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-400 text-sm">
                    <span>Delivery</span>
                    <span>FREE</span>
                  </div>
                  <div className="h-px bg-white/20 my-2" />
                  <div className="flex justify-between font-black text-lg">
                    <span>Total</span>
                    <span>₹{calculatedFinalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment - Compact */}
              {!showPaymentForm ? (
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-sm font-bold mb-4 flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </h4>
                  <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 p-2 bg-black/20 rounded-lg cursor-pointer hover:bg-emerald-500/10 text-xs">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-emerald-400"
                      />
                      <div>
                        <div className="font-bold">Cash on Delivery</div>
                        <div className="text-white/60">Pay on delivery</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-black/20 rounded-lg cursor-pointer hover:bg-white/5 text-xs">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-emerald-400"
                      />
                      <div>Card</div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-black/20 rounded-lg cursor-pointer hover:bg-white/5 text-xs">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-emerald-400"
                      />
                      <div>UPI</div>
                    </label>
                  </div>

                  <button
                    onClick={openPaymentForm}
                    disabled={cart.length === 0 || !defaultAddress}
                    className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl  uppercase tracking-wide shadow-lg border border-emerald-400/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {paymentMethod.toUpperCase()} ₹
                    {calculatedFinalTotal.toLocaleString()}
                  </button>
                </div>
              ) : (
                <div className="bg-black/40 border-2 border-white/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <h4 className="font-bold flex items-center gap-1">
                      {paymentMethod === "card" ? "💳 Card" : "📱 UPI"}
                    </h4>
                    <button
                      onClick={closePaymentForm}
                      className="text-white/60 hover:text-white"
                    >
                      ←
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-2 text-xs">
                      <input
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-sm"
                        placeholder="1234 5678 9012 3456"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-sm"
                          placeholder="MM/YY"
                        />
                        <input
                          className="bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-sm"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-2 text-xs">
                      <input
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-3 py-3 text-sm"
                        placeholder="user@paytm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select className="bg-black/50 border border-white/20 rounded-xl px-2 py-2 text-sm">
                          <option>Google Pay</option>
                          <option>PhonePe</option>
                        </select>
                        <div className="bg-green-500/20 text-green-400 px-2 py-2 rounded-xl font-bold flex items-center gap-1 text-xs">
                          ✓ Valid
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderPlaced}
                    className="w-full mt-4 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wide shadow-lg border border-emerald-400/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {orderPlaced ? (
                      <>
                        <div className="w-4 h-4 border border-white/30 border-t-emerald-400 rounded-full animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Pay ₹{calculatedFinalTotal.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              )}

              {paymentMethod === "cod" && !showPaymentForm && (
                <div className="bg-emerald-500/10 border-2 border-emerald-400/30 rounded-2xl p-4 text-center text-xs">
                  <Truck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <h4 className="font-bold text-emerald-400">
                    Cash on Delivery
                  </h4>
                  <p className="text-white/70">
                    Pay ₹{calculatedFinalTotal.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-emerald-500/95 to-emerald-600/95 border-4 border-white/20 rounded-3xl p-8 text-center shadow-2xl max-w-sm w-full transform animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              Order Placed!
            </h2>
            <p className="text-white/90 mb-4">Order #{orderNumber}</p>
            <div className="text-xs text-white/70 space-y-1">
              <p>✅ Redirecting to order details...</p>
              <p>Check your orders page</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderSummary;
