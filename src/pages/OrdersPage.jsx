import axios from "../utils/AxiosInstance";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/user/orders`);
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      await axios.delete(`/user/orders/${orderId}/cancel`);
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "cancelled", cancelledAt: new Date() }
            : order,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(`/user/order/${orderId}/delivered`, {});
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "delivered", deliveredAt: new Date() }
            : order,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to mark as delivered");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-2">
      <Header />
      <main className="pt-10 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400 text-sm">Track your recent orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 backdrop-blur-xl bg-black/50 rounded-3xl p-12 border border-white/10">
            <div className="w-24 h-24 mx-auto mb-8 bg-black/70 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <svg
                className="w-14 h-14 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Your orders will appear here once you start shopping.
            </p>
            <Link
              to="/market-mate/home"
              className="px-10 py-4 bg-white/10 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20 shadow-2xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {orders.map((order) => (
              <CompactOrderCard
                key={order._id}
                order={order}
                onCancelOrder={cancelOrder}
                onMarkDelivered={markAsDelivered}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

const CompactOrderCard = ({ order, onCancelOrder, onMarkDelivered }) => {
  const {
    _id,
    createdAt,
    totalAmount,
    orderStatus,
    paymentMethod,
    paymentStatus,
    products,
    address,
  } = order;

  const statusSteps = [
    {
      id: "placed",
      label: "Order Placed",
      icon: "📦",
      color: "bg-blue-500/20 border-blue-500/50",
    },
    {
      id: "confirmed",
      label: "Order Confirmed",
      icon: "✅",
      color: "bg-yellow-500/20 border-yellow-500/50",
    },
    {
      id: "shipped",
      label: "Shipped",
      icon: "🚚",
      color: "bg-purple-500/20 border-purple-500/50",
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: "📬",
      color: "bg-green-500/20 border-green-500/50",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      icon: "❌",
      color: "bg-red-500/20 border-red-500/50",
    },
  ];

  const currentStatusIndex = statusSteps.findIndex(
    (step) => step.id === orderStatus,
  );
  const canCancel =
    ["placed", "confirmed"].includes(orderStatus) && paymentStatus !== "failed";
  const canDeliver = orderStatus === "shipped";

  const getStatusBadge = () => {
    const colors = {
      delivered: "bg-green-500/90 text-white border-green-400",
      cancelled: "bg-red-500/90 text-white border-red-400",
      shipped: "bg-purple-500/90 text-white border-purple-400",
      confirmed: "bg-yellow-500/90 text-white border-yellow-400",
      placed: "bg-blue-500/90 text-white border-blue-400",
    };
    return colors[orderStatus] || "bg-gray-600 text-white border-gray-500";
  };

  return (
    <div className="group backdrop-blur-2xl bg-black/60 hover:bg-black/80 border border-white/20 rounded-3xl p-6  h-fit">
      {/* Header */}
      <div className="flex justify-between flex-col items-start mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white bg-linear -to-r from-white to-gray-200 bg-clip-text ">
            #{_id.slice(-8).toUpperCase()}
          </h3>
          <span
            className={`px-3 py-1 rounded-xl text-xs  ${getStatusBadge()} border-2`}
          >
            {orderStatus === "delivered"
              ? "✅ Delivered"
              : orderStatus === "cancelled"
                ? "❌ Cancelled"
                : statusSteps.find((s) => s.id === orderStatus)?.label}
          </span>
        </div>
        <div className="flex mt-2 gap-2">
          <div className="text-2xl font-black text-white">
            ₹{totalAmount?.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            by{" "}
            {paymentMethod === "cod"
              ? "Cash on Delivery"
              : paymentMethod?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Date & Items */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
        <span>
          {new Date(createdAt).toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="px-2 py-1 bg-white/10 rounded-lg text-xs">
          {products.length} {products.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* 🆕 TRACKING SECTION */}
      <div className="mb-4 p-4 bg-black/50 backdrop-blur-xl rounded-2xl border border-white/20">
        <h6 className="font-bold text-white mb-3 flex items-center gap-2 text-sm">
          📊 Order Tracking
        </h6>
        <div className="space-y-2">
          {statusSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                  step.color
                } border-2 ${
                  index < currentStatusIndex
                    ? "bg-white/20 text-white shadow-white/20"
                    : index === currentStatusIndex
                      ? "bg-white/30 text-white shadow-white shadow-lg animate-pulse"
                      : "bg-black/50 text-gray-500 border-white/30"
                }`}
              >
                {index < currentStatusIndex ? "✓" : step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium truncate ${
                    index <= currentStatusIndex ? "text-white" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {index === currentStatusIndex && (
                  <p className="text-xs text-blue-400 font-medium">
                    Current Status
                  </p>
                )}
              </div>
              {index < statusSteps.length - 1 && (
                <div
                  className={`w-20 h-0.5 rounded-full mx-2 ${
                    index < currentStatusIndex
                      ? "bg-white/40"
                      : index === currentStatusIndex
                        ? "bg-blue-500/50 animate-pulse"
                        : "bg-gray-800"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Product Preview */}
      <div className="mb-4">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: Math.min(3, products.length) }).map(
            (_, idx) => {
              const item = products[idx];

              // ✅ NULL CHECKS EVERYWHERE
              if (!item?.product) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="shrink-0 w-1/2 h-1/2 rounded-xl overflow-hidden bg-gray-900 border border-white/20 flex items-center justify-center text-xs text-gray-500"
                  >
                    Missing
                  </div>
                );
              }

              const { image, title } = item.product;
              const hasValidImage = image?.base64 && image?.contentType;

              return (
                <div
                  key={item._id || `product-${idx}`}
                  className="shrink-0 w-full p-2 h-26 rounded-xl overflow-hidden bg-black/50 border border-white/20 transition-transform relative group"
                >
                  {hasValidImage ? (
                    <img
                      src={`data:${image.contentType};base64,${image.base64}`}
                      alt={title || "Product"}
                      className="w-full h-full object-contain transition-all group-hover:scale-105 ease-in-out duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                  {idx === 2 && products.length > 3 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs font-bold text-white backdrop-blur-sm">
                      +{products.length - 3}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Address Preview */}
      {address && (
        <div className="mb-4 p-3 bg-black/40 rounded-2xl border border-white/10 text-xs text-gray-300">
          <div className="font-medium mb-1 flex items-center gap-2">
            📍 {address.name || "Home"}
          </div>
          <div className="truncate">
            {address.city}, {address.state} - {address.pincode}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        {canCancel && (
          <button
            onClick={() => onCancelOrder(_id)}
            className="flex-1 bg-red-500/90 hover:bg-red-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl border border-red-400 transition-all shadow-lg hover:shadow-red-500/50"
          >
            Cancel
          </button>
        )}
        {canDeliver && (
          <button
            onClick={() => onMarkDelivered(_id)}
            className="flex-1 bg-linear -to-r from-green-500 to-emerald-500/90 hover:from-green-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl border border-green-400 transition-all shadow-lg hover:shadow-green-500/50 animate-pulse"
          >
            Mark Delivered
          </button>
        )}
        <div
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-center border-2 transition-all ${
            orderStatus === "delivered"
              ? "bg-green-500/20 text-green-300 border-green-400"
              : orderStatus === "cancelled"
                ? "bg-red-500/20 text-red-300 border-red-400"
                : "bg-white/10 text-gray-400 border-white/20"
          }`}
        >
          {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
