import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router";

function CreateCarousel() {
  const [items, setItems] = useState([{ image: null, link: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addRow = () => {
    if (items.length >= 5) {
      setError("Maximum 5 carousel items allowed");
      return;
    }
    setError("");
    setItems([...items, { image: null, link: "" }]);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleImageChange = (index, file) => {
    const updated = [...items];
    updated[index].image = file;
    setItems(updated);
  };

  const handleLinkChange = (index, value) => {
    const updated = [...items];
    updated[index].link = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError("At least one carousel item is required");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].image || !items[i].link.trim()) {
        setError(`Image and link are required for item ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);

      const formData = new FormData();
      const productLinks = [];

      items.forEach((item) => {
        formData.append("image", item.image);
        productLinks.push(item.link);
      });

      formData.append("productLinks", JSON.stringify(productLinks));

      await axios.post(
        "http://localhost:5000/market-mate/user/carousel/create",
        formData,
        { withCredentials: true }
      );

      setSuccess("Carousel created successfully");
      setItems([{ image: null, link: "" }]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create carousel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3 mt-3">
      <div className="w-full bg-linear-to-br from-black/70 to-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Carousel Manager
        </h2>

        <p className="max-w-xl px-4 py-3 my-2 text-sm md:text-base border border-white/20 rounded-3xl text-white/80">
          To create a new carousel, you must delete the existing one first.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ITEMS */}
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 items-center bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                {/* IMAGE INPUT */}
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs text-white/60 mb-1 block">
                    Carousel Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="w-full text-sm text-white file:mr-4 file:py-2 file:px-4
                             file:rounded-xl file:border-0
                             file:bg-white file:text-black
                             hover:file:bg-gray-200 cursor-pointer"
                  />
                </div>

                {/* LINK INPUT */}
                <div className="col-span-12 md:col-span-7">
                  <label className="text-xs text-white/60 mb-1 block">
                    Product Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://example.com/product"
                    value={item.link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3
                             text-sm text-white outline-none focus:border-white/30"
                  />
                </div>

                {/* REMOVE */}
                {items.length > 1 && (
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="text-red-400 hover:text-red-300 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ADD ROW */}
          <button
            type="button"
            onClick={addRow}
            className="w-fit px-4 py-2 rounded-xl border border-dashed border-white/20
                     text-sm text-white/70 hover:text-white hover:border-white/40 transition"
          >
            + Add Carousel Item
          </button>

          {/* STATUS */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
              {success}
            </p>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-xs  md:text-sm font-medium transition-all ${
                loading
                  ? "bg-gray-500 text-black cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {loading ? "Uploading..." : "Create Carousel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCarousel;
