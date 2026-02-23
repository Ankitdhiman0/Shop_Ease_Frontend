import React, { useState, useEffect } from "react";
import axios from "../../utils/AxiosInstance";
import { Link, useParams } from "react-router-dom";

function AdminOrders() {
  const { id } = useParams(); // User ID from URL
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchUserOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/user/admin/orders/${id}`);
      setOrders(res.data.orders || []);
    } catch (error) {
      setError("Failed to fetch user orders");
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/market-mate/admin/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Users
            </Link>
          </div>
          <button
            onClick={fetchUserOrders}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-all"
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      <main className="pt-8 px-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h18l-2 12H5L3 3zm0 0v0m0 0V9a1 1 0 001-1V6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 001 1v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-9a1 1 0 00-1-1V3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">
                This user has not placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-purple-400 truncate max-w-32">
                          {order._id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === "delivered"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : order.orderStatus === "shipped"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : order.orderStatus === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                  : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          {order.orderStatus?.toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xl font-bold text-white">
                          ₹{order.totalAmount?.toLocaleString() || "0"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">
                          {order.products.length || 0} items
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminOrders;
