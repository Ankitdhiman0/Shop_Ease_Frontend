import React, { useEffect, useState } from "react";
import axios from "axios";

function UpdateCarousel() {
  const [items, setItems] = useState([]);
  const [carouselId, setCarouselId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FETCH CAROUSEL
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/market-mate/user/new/carousel",
          { withCredentials: true }
        );

        if (res.data?.data) {
          setCarouselId(res.data.data._id);

          setItems(
            res.data.data.items.map((item, index) => ({
              image: null,
              existingImageName: `carousel-image-${index + 1}`,
              link: item.productLink,
            }))
          );
        }
      } catch {
        setError("Failed to load carousel");
      }
    };

    fetchCarousel();
  }, []);

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

  // DELETE CAROUSEL
  const handleDelete = async () => {
    if (!carouselId) return;

    const confirmDelete = window.confirm(
      "This will delete the entire carousel. Continue?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/market-mate/user/carousel/delete/${carouselId}`,
        { withCredentials: true }
      );

      setItems([]);
      setSuccess("Carousel deleted successfully");
    } catch {
      setError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE CAROUSEL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const formData = new FormData();
      const productLinks = [];

      items.forEach((item) => {
        if (item.image) formData.append("image", item.image);
        productLinks.push(item.link);
      });

      formData.append("productLinks", JSON.stringify(productLinks));

      await axios.put(
        "http://localhost:5000/market-mate/user/carousel/update",
        formData,
        { withCredentials: true }
      );

      setSuccess("Carousel updated successfully");
    } catch {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-3">
      <div className="bg-black/70 border border-white/10 rounded-3xl p-6 text-white">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Update Carousel</h2>

          <button
            type="button"
            onClick={handleDelete}
            className="px-5 py-2 text-xs bg-red-600 rounded-xl hover:bg-red-700"
          >
            Delete
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 overflow-hidden"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-2xl"
            >
              <p className="text-green-400">{item.existingImageName}</p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
              />

              <input
                type="url"
                value={item.link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="Product link"
                className="bg-black/60 border border-white/20 rounded-xl px-3 py-2 w-68 md:w-60 lg:w-96"
              />
            </div>
          ))}

          {error && <p className="text-red-400">{error}</p>}
          {success && <p className="text-green-400">{success}</p>}

          <div className="flex justify-end">
            <button
              disabled={loading}
              className="px-8 text-xs py-3 bg-white text-black rounded-xl"
            >
              {loading ? "Updating..." : "Update Carousel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCarousel;
