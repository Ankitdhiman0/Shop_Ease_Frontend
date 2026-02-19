import axios from "../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { Edit3, Trash2, Plus, MapPin, Home, Crown } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [settingDefault, setSettingDefault] = useState({});

  useEffect(() => {
    const getAllAddresses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/market-mate/user/get/addresses`);
        setAddresses(res.data.addresses || res.data || []);
      } catch (error) {
        console.error(error);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    getAllAddresses();
  }, []);

  const handleRemoveAddress = async (id) => {
    if (!confirm("Remove this address?")) return;

    try {
      setDeleting((prev) => ({ ...prev, [id]: true }));
      await axios.delete(`/market-mate/user/address/${id}/remove`, {
        withCredentials: true,
      });
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to remove address");
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleEditAddress = (address) => {
    // Store address in localStorage/sessionStorage for edit form
    localStorage.setItem("editingAddress", JSON.stringify(address));
    navigate("/market-mate/user/address/register");
  };

  const handleSetDefault = async (id) => {
    try {
      setSettingDefault((prev) => ({ ...prev, [id]: true }));
      await axios.post(
        `/market-mate/user/address/${id}/setdefault`,
        {},
        { withCredentials: true },
      );

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) =>
          addr._id === id
            ? { ...addr, isDefault: true }
            : { ...addr, isDefault: false },
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to set default address");
    } finally {
      setSettingDefault((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Header />
        <div className="h-96 flex justify-center items-center">
          <div className="text-xl font-medium">Loading addresses...</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white p-2">
      <Header />

      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black tracking-tight">My Addresses</h1>
          </div>
          <button
            onClick={() => navigate("/market-mate/user/address/register")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-3 px-8 rounded-xl flex items-center gap-2 transition-all duration-200"
          >
            Add New Address
          </button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-24 text-white/40">
              <MapPin className="w-24 h-24 mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold mb-2">No addresses saved</h2>
              <p className="text-lg">Add your first delivery address</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address._id}
                className="group bg-black/20 border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Address Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-xl font-bold">{address.street}</h3>
                      </div>

                      <p className="text-white/70 flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {address.city}, {address.state}
                      </p>

                      <p className="text-sm text-white/50">
                        {address.pincode} • {address.phone}
                      </p>
                    </div>

                    {/* Default Badge */}
                    {address.isDefault && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded-full text-sm font-bold mb-4">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                        Default Address
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-6 shrink-0">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        disabled={settingDefault[address._id]}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all flex items-center gap-1 disabled:opacity-50"
                        title="Set as default"
                      >
                        {settingDefault[address._id] ? (
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Crown className="w-5 h-5" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-all flex items-center gap-1"
                      title="Edit address"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleRemoveAddress(address._id)}
                      disabled={deleting[address._id]}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-all flex items-center gap-1 disabled:opacity-50"
                      title="Remove address"
                    >
                      {deleting[address._id] ? (
                        <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default AddressesPage;
