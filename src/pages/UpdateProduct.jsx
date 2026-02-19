import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Header from "../components/Header";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    target: "",
    price: "",
    discount: "",
    image: null,
    specs: [{ key: "", value: "" }],
    offers: [{ title: "", discount: "" }],
  });

  /* ---------------- FETCH PRODUCT ---------------- */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/market-mate/product/find/${id}`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          const p = res.data.product;

          setForm({
            title: p.title || "",
            description: p.description || "",
            category: p.category || "",
            subCategory: p.subCategory || "",
            target: p.target || "",
            price: p.price || "",
            discount: p.discount || "",
            image: null, // IMPORTANT
            specs: p.specs?.length ? p.specs : [{ key: "", value: "" }],
            offers: p.offers?.length ? p.offers : [{ title: "", discount: "" }],
          });
        }
      } catch (err) {
        console.error(err);
        navigate("/market-mate/seller/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  /* ---------------- HANDLERS (same as register) ---------------- */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...form.specs];
    updated[index][field] = value;
    setForm({ ...form, specs: updated });
  };

  const addSpec = () => {
    setForm({ ...form, specs: [...form.specs, { key: "", value: "" }] });
  };

  const removeSpec = (index) => {
    setForm({
      ...form,
      specs: form.specs.filter((_, i) => i !== index),
    });
  };

  const handleOfferChange = (index, field, value) => {
    const updated = [...form.offers];
    updated[index][field] = value;
    setForm({ ...form, offers: updated });
  };

  const addOffer = () => {
    setForm({
      ...form,
      offers: [...form.offers, { title: "", discount: "" }],
    });
  };

  const removeOffer = (index) => {
    setForm({
      ...form,
      offers: form.offers.filter((_, i) => i !== index),
    });
  };

  /* ---------------- UPDATE SUBMIT ---------------- */

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "specs" || key === "offers") {
        formData.append(key, JSON.stringify(value));
      } else if (key === "image") {
        if (value) formData.append("image", value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await axios.post(
        `http://localhost:5000/market-mate/product/update/${id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data?.success) {
        navigate("/market-mate/seller/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="border border-white/10 bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Update Product
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Complete all fields to update your product
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Product Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="e.g. Premium Leather Wallet"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Target Audience
                </label>
                <input
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="Men / Women / Kids / Unisex"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition resize-vertical"
                placeholder="Highlight key features and benefits..."
              />
            </div>

            {/* CATEGORIES & PRICING */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="e.g. Accessories"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Sub-category
                </label>
                <input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="e.g. Wallets"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="99.99"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition"
                  placeholder="10"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                Product Image
              </label>
              <label
                htmlFor="image"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl text-sm text-white/50 cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all"
              >
                {form.image ? (
                  <span className="truncate max-w-[80%]">
                    {form.image.name}
                  </span>
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Click to upload image
                  </>
                )}
              </label>
              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                required
              />
            </div>

            {/* SPECS */}
            <div className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
                  Specifications
                </h3>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-xs uppercase tracking-[0.18em] text-white/60 hover:text-white hover:underline flex items-center gap-1"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {form.specs.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <input
                      placeholder="Key (e.g. Material)"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecChange(index, "key", e.target.value)
                      }
                      className="flex-1 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <input
                      placeholder="Value (e.g. Leather)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(index, "value", e.target.value)
                      }
                      className="flex-1 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="w-8 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* OFFERS */}
            <div className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
                  Special Offers
                </h3>
                <button
                  type="button"
                  onClick={addOffer}
                  className="text-xs uppercase tracking-[0.18em] text-white/60 hover:text-white hover:underline flex items-center gap-1"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {form.offers.map((offer, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <input
                      placeholder="Offer title"
                      value={offer.title}
                      onChange={(e) =>
                        handleOfferChange(index, "title", e.target.value)
                      }
                      className="flex-1 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={offer.discount}
                      onChange={(e) =>
                        handleOfferChange(index, "discount", e.target.value)
                      }
                      className="w-24 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      className="w-8 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full bg-white text-black text-sm font-semibold tracking-[0.15em] uppercase py-4 rounded-xl border-2 border-white/80 hover:bg-black hover:text-white hover:border-white transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Update Product
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default UpdateProduct;
