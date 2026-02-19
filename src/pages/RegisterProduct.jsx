import axios from "axios";
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function RegisterProduct() {
  const navigate = useNavigate();
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

  // Category & SubCategory Data
  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Grocery & Essentials",
    "Health & Wellness",
    "Sports & Fitness",
    "Books & Stationery",
    "Toys & Baby",
    "Automotive",
    "Tools & Hardware",
    "Jewellery & Accessories",
    "Furniture",
    "Appliances",
    "Gaming",
    "Office Supplies",
    "Pet Supplies",
    "Music & Instruments",
  ];

  const subCategories = {
    Electronics: [
      "Mobiles",
      "Laptops",
      "Tablets",
      "Wearables",
      "Audio",
      "Cameras",
      "Accessories",
      "Networking Devices",
      "Smart-Home",
      "Storage-Devices",
    ],
    Fashion: [
      "Men-Clothing",
      "Women-Clothing",
      "Kids-Clothing",
      "Footwear",
      "Watches",
      "Bags",
      "Sunglasses",
      "Wallets",
    ],
    "Home & Kitchen": [
      "Cookware",
      "Kitchen-Appliances",
      "Home Decor",
      "Bedding",
      "Lighting",
      "Storage-Organization",
      "Cleaning-Supplies",
    ],
    "Beauty & Personal Care": [
      "Skincare",
      "Haircare",
      "Makeup",
      "Fragrances",
      "Grooming",
      "Personal-Hygiene",
    ],
    "Grocery & Essentials": [
      "Staples",
      "Snacks & Beverages",
      "Packaged Food",
      "Cooking Ingredients",
      "Household Essentials",
    ],
    "Health & Wellness": [
      "Supplements",
      "Medical Devices",
      "Fitness Equipment",
      "Ayurvedic Products",
      "Personal Safety",
    ],
    "Sports & Fitness": [
      "Gym-Equipment",
      "Outdoor-Sports",
      "Indoor-Games",
      "Sportswear",
      "Fitness-Accessories",
    ],
    "Books & Stationery": [
      "Academic Books",
      "Novels",
      "Comics",
      "Exam Prep",
      "Office Stationery",
      "Art Supplies",
    ],
    "Toys & Baby": [
      "Baby Care",
      "Baby Clothing",
      "Toys",
      "Educational Toys",
      "School Supplies",
    ],
    Automotive: [
      "Car Accessories",
      "Bike Accessories",
      "Spare Parts",
      "Safety Gear",
      "Lubricants",
    ],
    "Tools & Hardware": [
      "Power Tools",
      "Hand Tools",
      "Electricals",
      "Plumbing Tools",
      "Safety Equipment",
    ],
    "Jewellery & Accessories": [
      "Gold Jewellery",
      "Silver Jewellery",
      "Artificial Jewellery",
      "Sunglasses",
      "Hair Accessories",
    ],
    Furniture: [
      "Living Room Furniture",
      "Bedroom Furniture",
      "Office Furniture",
      "Outdoor Furniture",
      "Storage Furniture",
    ],
    Appliances: [
      "Large Appliances",
      "Small Appliances",
      "Heating & Cooling",
      "Water Purifiers",
    ],
    Gaming: ["Consoles", "Games", "Gaming Accessories", "Gaming Chairs"],
    "Office Supplies": [
      "Office Furniture",
      "Printers & Scanners",
      "Writing Supplies",
      "Filing & Storage",
    ],
    "Pet Supplies": ["Pet Food", "Pet Grooming", "Pet Toys", "Pet Health"],
    "Music & Instruments": [
      "Musical Instruments",
      "Audio Equipment",
      "Studio Accessories",
    ],
  };

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (category) => {
    setForm((prev) => ({ ...prev, category, subCategory: "" }));
    setShowCategoryDropdown(false);
  };

  const handleSubCategorySelect = (subCategory) => {
    setForm((prev) => ({ ...prev, subCategory }));
    setShowSubCategoryDropdown(false);
  };

  // Rest of handlers remain exactly the same
  const handleSpecChange = (index, field, value) => {
    const updated = [...form.specs];
    updated[index][field] = value;
    setForm({ ...form, specs: updated });
  };

  const addSpec = () => {
    setForm({ ...form, specs: [...form.specs, { key: "", value: "" }] });
  };

  const removeSpec = (index) => {
    const updated = form.specs.filter((_, i) => i !== index);
    setForm({ ...form, specs: updated });
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
    const updated = form.offers.filter((_, i) => i !== index);
    setForm({ ...form, offers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Product image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("target", form.target);
    formData.append("price", Number(form.price));
    formData.append("discount", Number(form.discount));
    formData.append("image", form.image);
    formData.append("specs", JSON.stringify(form.specs));
    formData.append("offers", JSON.stringify(form.offers));

    try {
      const res = await axios.post(
        "http://localhost:5000/market-mate/product/register",
        formData,
        { withCredentials: true }
      );

      if (res.data?.success) {
        navigate(`/market-mate/seller/dashboard/`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to register product");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-2">
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="border border-white/10 bg-black/60 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Register Product
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Complete all fields to list your product
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Men / Women / Kids / family"
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
              {/* Category Dropdown - Manual Select Only */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Category
                </label>
                <div className="relative">
                  <input
                    readOnly
                    name="category"
                    value={form.category}
                    onFocus={() => setShowCategoryDropdown(true)}
                    className="w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition pr-10 cursor-pointer"
                    placeholder="Click to select category"
                  />
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-white/20 rounded-lg max-h-48 overflow-auto z-20 shadow-2xl">
                      {categories.map((cat) => (
                        <div
                          key={cat}
                          onClick={() => handleCategorySelect(cat)}
                          className="px-4 py-2.5 text-sm hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SubCategory Dropdown - Manual Select Only */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 block">
                  Sub-category
                </label>
                <div className="relative">
                  <input
                    readOnly
                    name="subCategory"
                    value={form.subCategory}
                    onFocus={() => setShowSubCategoryDropdown(true)}
                    disabled={!form.category}
                    className={`w-full bg-black border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/70 transition pr-10 cursor-pointer ${
                      !form.category ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    placeholder={
                      form.category
                        ? "Click to select sub-category"
                        : "Select category first"
                    }
                  />
                  {showSubCategoryDropdown &&
                    form.category &&
                    subCategories[form.category] && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 border border-white/20 rounded-lg max-h-48 overflow-auto z-20 shadow-2xl">
                        {subCategories[form.category].map((sub) => (
                          <div
                            key={sub}
                            onClick={() => handleSubCategorySelect(sub)}
                            className="px-4 py-2.5 text-sm hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
                          >
                            {sub}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
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

            {/* IMAGE UPLOAD - SAME EXACT UI */}
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

            {/* SPECS - SAME EXACT UI */}
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
                      className=" bg-black/50 w-1/2 border border-white/15 rounded-lg px-3 py-2 text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <input
                      placeholder="Value (e.g. Leather)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(index, "value", e.target.value)
                      }
                      className=" bg-black/50 border w-1/2 border-white/15 rounded-lg px-3 py-2  text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="p-1 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                      className=" bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <input
                      type="number"
                      placeholder="Discount %"
                      value={offer.discount}
                      onChange={(e) =>
                        handleOfferChange(index, "discount", e.target.value)
                      }
                      className="w-14 bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs  md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => removeOffer(index)}
                      className="p-1 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT - SAME EXACT UI */}
            <button
              type="submit"
              className="w-full bg-white text-black text-sm font-semibold tracking-[0.15em] uppercase py-3 rounded-xl border-2 border-white/80 hover:bg-black hover:text-white hover:border-white transition-all duration-200 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Register Product
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default RegisterProduct;
