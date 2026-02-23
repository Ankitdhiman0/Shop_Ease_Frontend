import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function HomeKitchen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const category = "home%26kitchen";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/product/filter?category=${category}`);

        if (res.data?.success) {
          // Show only first 10 products
          setProducts(res.data.products.slice(0, 10));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProducts();
  }, []);

  const getImageSrc = (image) => {
    if (!image?.data) return null;

    const base64String = btoa(
      new Uint8Array(image.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        "",
      ),
    );

    return `data:${image.contentType};base64,${base64String}`;
  };

  return (
    <main className="w-full bg-black">
      <h1 className="text-2xl font-bold text-white mb-7 border-b border-white/20 pb-4">
        Home & Kitchen
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((item) => (
          <div
            onClick={() => navigate(`/shop-ease/product/details/${item._id}`)}
            key={item._id.$oid || item._id}
            className="group bg-black border cursor-pointer border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="w-full h-32">
              <img
                src={getImageSrc(item.image)}
                alt={item.title}
                className="w-full h-full object-contain group transition-all duration-500"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 mb-2 group-hover:text-gray-200">
                {item.title}
              </h3>

              <div className="space-y-1">
                <p className="text-lg text-white">
                  ₹{Math.round(item.price - (item.price * item.discount) / 100)}
                </p>
                {item.discount > 0 && (
                  <p className="text-xs text-gray-500 line-through">
                    ₹{item.price}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="col-span-full text-center py-20 text-gray-500">
          No home & kitchen products available
        </div>
      )}
    </main>
  );
}

export default HomeKitchen;
