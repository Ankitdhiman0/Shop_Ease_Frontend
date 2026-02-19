import React, { useState } from "react";
import axios from "../utils/AxiosInstance";
import { ArrowLeft, MapPin, Phone, Home, Check } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

function RegisterAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const ukPhoneRegex = /^(\+44\s?\d{2,4}|\(?0\d{2,4}\)?)\s?\d{3,4}\s?\d{3,4}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGeoSuccess = async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      );
      const data = await res.json();
      fillAddressFromGeo(data.address);
    } catch {
      setLocError("Failed to fetch address");
    } finally {
      setLocLoading(false);
    }
  };

  const handleGeoError = (error) => {
    setLocLoading(false);

    switch (error.code) {
      case 1:
        setLocError("Location permission denied");
        break;
      case 2:
        setLocError("Location unavailable");
        break;
      case 3:
        setLocError("Location request timed out");
        break;
      default:
        setLocError("Failed to get location");
    }
  };

  const fillAddressFromGeo = (address) => {
    setForm((prev) => ({
      ...prev,
      street:
        address.road || address.house_number || address.neighbourhood || "",
      city: address.city || address.town || address.village || "",
      state: address.county || address.state || "",
      pincode: address.postcode || "",
    }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser");
      return;
    }

    setLocError("");
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ukPhoneRegex.test(form.phone)) {
      alert("Enter a valid UK phone number");
      return;
    }

    if (!form.street || !form.city || !form.state || !form.pincode) {
      alert("All address fields are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/market-mate/user/address`, {
        ...form,
        phone: form.phone.replace(/\s+/g, ""),
      });
      navigate("/market-mate/user/addresses");
    } catch (error) {
      console.error(error);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white p-2">
      <Header />

      <section className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/market-mate/home")}
            className="p-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Delivery Address
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Add your delivery details
            </p>
          </div>
        </div>

        {/* Main Form - Full Width Smaller */}
        <div className="w-full bg-black/20 border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Location Button */}
            <div>
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locLoading}
                className="w-full flex items-center justify-center gap-2 p-3 bg-white/5 border-2 border-emerald-400/30 rounded-xl text-emerald-300 font-medium hover:bg-emerald-500/10 transition-all disabled:opacity-50"
              >
                {locLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use my current location
                  </>
                )}
              </button>

              {locError && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  {locError}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-white/80">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+44 123 456 7890"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-base placeholder-white/30 focus:border-emerald-400 focus:outline-none transition-all"
              />
            </div>

            {/* Street */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-white/80">
                <MapPin className="w-4 h-4" />
                Street Address
              </label>
              <input
                type="text"
                name="street"
                placeholder="123 High Street"
                value={form.street}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-base placeholder-white/30 focus:border-emerald-400 focus:outline-none transition-all"
              />
            </div>

            {/* City & Postcode */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="London"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-base placeholder-white/30 focus:border-emerald-400 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="SW1A 1AA"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-base placeholder-white/30 focus:border-emerald-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-xs font-semibold text-white/80">
                <Home className="w-4 h-4" />
                County/State
              </label>
              <input
                type="text"
                name="state"
                placeholder="Greater London"
                value={form.state}
                onChange={handleChange}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-base placeholder-white/30 focus:border-emerald-400 focus:outline-none transition-all"
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-black/20 border border-white/10 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-400 bg-black/30 border-2 border-white/20 rounded focus:ring-emerald-400"
                />
                <span className="text-sm font-medium text-white/90">
                  Set as default address
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-base uppercase tracking-wide border border-emerald-400/30 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Address
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default RegisterAddress;
