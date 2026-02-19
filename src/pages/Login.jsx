import axios from "../utils/AxiosInstance";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`/market-mate/user/login`, form);

      if (!res.data?.success) {
        setError(res.data?.message || "Login failed");
        return;
      }

      const user = res.data.user;

      // ROLE BASED NAVIGATION
      if (user?.isAdmin) {
        navigate("/market-mate/admin/description", {
          state: { user },
        });
      } else {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/market-mate/home", {
          state: { user },
        });
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
    <main className="bg-black w-full min-h-screen  p-2 flex flex-col space-y-[1vh]">
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
        <section className="h-[85vh] w-full  rounded-3xl p-4 flex gap-4  md:bg-white/5 backdrop-blur-xl">
          <div className="w-full md:w-1/2 h-full bg-white/10 backdrop-blur-3xl rounded-2xl flex flex-col justify-center px-8">
            <h2 className="text-2xl font-semibold text-white mb-1">Login</h2>
            <p className="text-sm text-gray-400 mb-8">
              Enter your credentials to continue.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              autoComplete="off"
            >
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />

              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 rounded-xl py-3 text-sm font-medium transition ${
                  loading
                    ? "bg-gray-400 text-black cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-gray-400 mt-6">
              Don’t have an account?{" "}
              <Link
                to="/market-mate/register"
                className="text-white hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
          {/* LEFT PANEL */}
          <div className="relative w-1/2 h-full rounded-2xl overflow-hidden hidden md:block">
            <img
              src="/c.jpg"
              alt="Market Mate"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 " />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
              <h1 className="special-text text-3xl font-medium tracking-wider mb-2">
                Market-Mate
              </h1>
              <p className="text-sm text-gray-200">
                Buy, sell, and manage products with speed and simplicity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
