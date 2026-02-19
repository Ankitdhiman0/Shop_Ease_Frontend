import axios from "../utils/AxiosInstance";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // hard stop

    setError("");

    try {
      setLoading(true);

      const res = await axios.post(`/market-mate/user/register`, form);

      // assume backend returns { success: true }
      if (res.data?.success) {
        navigate("/market-mate/login");
      } else {
        setError(res.data?.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black w-full min-h-screen flex flex-col p-2 space-y-[1vh] ">
      <header className="text-white/80 border border-white/20 rounded-2xl px-4 py-2 flex justify-between items-center">
        <div className="text-sm leading-tight">
          <h1 className="font-bold text-lg">Market</h1>
          <h1 className="font-bold text-lg">Mate</h1>
        </div>

        <p className="text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
          Welcome to Market-Mate
        </p>
      </header>

      <div className="w-full flex items-center justify-center">
        <section className="h-[85vh] w-full  rounded-3xl p-4 flex gap-4 md:bg-white/5 backdrop-blur-xl">
          <div className="relative w-1/2 h-full rounded-2xl overflow-hidden hidden md:block">
            <img
              src="/Darkshell2012.jpeg"
              alt="Market Mate"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
              <h1 className="text-3xl font-medium tracking-wider mb-2">
                Market-Mate
              </h1>
              <p className="text-sm text-gray-300">
                Join the new era of ecommerce. Buy, sell, and manage products
                with speed, security, and simplicity.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-1/2 h-full bg-white/10 backdrop-blur-3xl rounded-2xl flex flex-col justify-center px-8">
            <h2 className="text-2xl font-semibold text-white mb-1">Register</h2>
            <p className="text-sm text-gray-400 mb-8">
              Create your account to get started.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Username"
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />

              {/* ERROR */}
              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 rounded-xl py-3 text-sm font-medium transition
                ${
                  loading
                    ? "bg-gray-400 text-black cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/market-mate/login"
                className="text-white hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterUser;
