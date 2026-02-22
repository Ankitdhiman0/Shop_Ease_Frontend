import axios from "../utils/AxiosInstance";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 chars, at least 1 letter and 1 number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/market-mate/user/otp/request", {
        email: form.email,
        purpose: "register",
      });

      setOtpSent(true);
      setSuccessMessage("OTP sent successfully to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.name || !form.email || !form.password || !form.otp) {
      setError("All fields are required");
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password must be at least 8 characters with at least one letter and one number",
      );
      return;
    }

    if (!/^\d{6}$/.test(form.otp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/market-mate/user/register", {
        email: form.email,
        name: form.name,
        password: form.password,
        otp: form.otp,
        purpose: "register",
      });

      setSuccessMessage("Registration successful! Redirecting...");

      // Clear sensitive data
      setForm({
        name: "",
        email: "",
        password: "",
        otp: "",
      });

      setTimeout(() => {
        navigate("/market-mate/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black w-full min-h-screen flex flex-col p-2 space-y-[1vh]">
      <header className="text-white/80 border border-white/20 rounded-2xl px-4 py-2 flex justify-between items-center">
        <div className="text-sm leading-tight">
          <h1 className="font-bold text-lg">Market</h1>
          <h1 className="font-bold text-lg">Mate</h1>
        </div>
      </header>

      <div className="w-full flex items-center justify-center">
        <section className="h-[85vh] w-full rounded-3xl p-4 flex gap-4 md:bg-white/5 backdrop-blur-xl">
          <div className="relative w-1/2 h-full rounded-2xl overflow-hidden hidden md:block">
            //{" "}
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
          <div className="w-full md:w-1/2 h-full bg-white/10 backdrop-blur-3xl rounded-2xl flex flex-col justify-center px-8">
            <h2 className="text-2xl font-semibold text-white mb-1">Register</h2>
            <p className="text-sm text-gray-400 mb-8">
              Create your account to get started.
            </p>

            {/* OTP REQUEST */}
            {!otpSent && (
              <form onSubmit={requestOTP} className="flex flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter email"
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                />

                {error && <p className="text-xs text-red-400">{error}</p>}
                {successMessage && (
                  <p className="text-xs text-green-400">{successMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl py-3 text-sm font-medium bg-white text-black"
                >
                  {loading ? "Requesting OTP..." : "Request OTP"}
                </button>
              </form>
            )}

            {/* REGISTER */}
            {otpSent && (
              <form onSubmit={registerUser} className="flex flex-col gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Username"
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />

                <input
                  name="email"
                  value={form.email}
                  readOnly
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white opacity-70"
                />

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Password"
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />

                <input
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Enter 6-digit OTP"
                  className="bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                />

                {error && <p className="text-xs text-red-400">{error}</p>}
                {successMessage && (
                  <p className="text-xs text-green-400">{successMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl py-3 text-sm font-medium bg-white text-black"
                >
                  {loading ? "Creating account..." : "Register"}
                </button>

                {/* Resend OTP */}
                <button
                  type="button"
                  onClick={requestOTP}
                  disabled={loading}
                  className="text-xs text-gray-400 hover:underline mt-2"
                >
                  Resend OTP
                </button>
              </form>
            )}

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
