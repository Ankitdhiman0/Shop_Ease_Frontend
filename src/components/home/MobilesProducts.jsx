import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function MobilesProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/product/filter?subCategory=mobiles`);

        if (res.data?.success) {
          // Add imageSrc directly from backend base64 & limit to 10 products
          const productsWithImages = res.data.products
            .slice(0, 10) // Show only first 10 products
            .map((product) => ({
              ...product,
              imageSrc: product.image?.base64
                ? `data:${product.image.contentType};base64,${product.image.base64}`
                : null,
            }));
          setProducts(productsWithImages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="w-full bg-black">
      <h1 className="text-2xl font-bold text-white mb-4 border-b border-white/20 pb-4">
        Mobiles
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((item) => (
          <div
            onClick={() => navigate(`/shop-ease/product/details/${item._id}`)}
            key={item._id}
            className="group bg-black border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Image */}
            <div className="w-full h-32">
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-contain group transition-all duration-500 p-2"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 mb-2 group-hover:text-gray-200">
                {item.title}
              </h3>

              <div className="space-y-1">
                <p className="text-lg  text-white">
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
          No mobiles available
        </div>
      )}
    </main>
  );
}

export default MobilesProducts;
