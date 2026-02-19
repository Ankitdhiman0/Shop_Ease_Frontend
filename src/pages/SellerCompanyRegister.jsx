import React, { useState } from "react";
import Header from "../components/Header";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router";

function SellerCompanyRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo") {
      setForm((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("address", form.address);
    if (form.logo) formData.append("logo", form.logo);

    try {
      const res = await axios.post(
        `/market-mate/user/seller/company/register`,
        formData,
      );

      if (res.data?.success) {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
          console.error("User missing in localStorage");
          return;
        }

        storedUser.isSeller = true;
        localStorage.setItem("user", JSON.stringify(storedUser));

        navigate("/market-mate/seller/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-black text-white p-2">
        <Header />
        <section className="flex justify-center px-4 py-6">
          <div className="w-full max-w-xl   border border-white/10 bg-black/60 backdrop-blur-sm rounded-xl p-5 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <h1 className="text-xl font-semibold tracking-tight mb-0.5">
              Register Brand
            </h1>
            <p className="text-[11px] text-white/50 mb-4">
              Minimal black & white interface for your seller brand profile.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs uppercase tracking-[0.15em] text-white/60"
                >
                  Brand Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-md px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="e.g. Noir Studio"
                  required
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="description"
                  className="text-xs uppercase tracking-[0.15em] text-white/60"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-md px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition resize-none h-16"
                  placeholder="Describe your brand in one or two lines"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="address"
                  className="text-xs uppercase tracking-[0.15em] text-white/60"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-md px-3 py-1.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="Office or warehouse location"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.15em] text-white/60 block">
                  Logo
                </span>

                <label
                  htmlFor="logo"
                  className="flex items-center justify-between w-full border border-dashed border-white/20 rounded-md px-3 py-1.5 text-[11px] text-white/60 cursor-pointer hover:border-white/60 hover:bg-white/5 transition"
                >
                  <span className="truncate">
                    {form.logo ? form.logo.name : "Upload logo"}
                  </span>
                  <span className="border border-white/40 px-2 py-0.5 rounded text-[10px] tracking-[0.18em] uppercase">
                    Browse
                  </span>
                </label>
                <input
                  id="logo"
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
                <p className="text-[10px] text-white/40">
                  PNG or SVG. Transparent background preferred.
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-1.5 bg-white text-black text-xs font-medium tracking-[0.15em] uppercase py-2 rounded-md border border-white/80 hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
              >
                <span>Register Company</span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

export default SellerCompanyRegister;
