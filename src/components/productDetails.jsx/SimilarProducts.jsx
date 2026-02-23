import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SimilarProducts({ productId, category, subCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!category || !subCategory) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/product/filter`, {
          params: {
            category: category.toLowerCase(),
            subCategory: subCategory.toLowerCase(),
          },
        });

        const filtered = res.data.products
          .filter((p) => p._id !== productId)
          .slice(0, 20);

        setProducts(filtered);
      } catch (error) {
        console.error("Similar products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subCategory, productId]);

  // Wireframe loading state
  if (loading) {
    return (
      <section className="mt-12 scrollbar-hide">
        <div className="mb-4 animate-pulse">
          <div className="h-6 w-40 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="min-w-40 rounded-lg border border-white/15 bg-black/30 p-3 animate-pulse h-52 flex flex-col justify-between"
            >
              {/* Image skeleton */}
              <div className="h-30 w-full rounded-md bg-linear-to-r from-white/10 via-white/20 to-white/10" />

              {/* Title skeleton */}
              <div className="h-4 w-3/4 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mt-2" />

              {/* Target skeleton */}
              <div className="h-3 w-1/2 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mt-1" />

              {/* Price skeleton */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-5 w-12 bg-linear-to-r from-green-400/30 via-green-400/50 to-green-400/30 rounded" />
                <div className="h-3 w-10 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
                <div className="h-3 w-16 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="mt-12 scrollbar-hide">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Similar Products
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {products.map((product) => {
          const discountedPrice =
            product.discount > 0
              ? Math.round(
                  product.price - (product.price * product.discount) / 100,
                )
              : product.price;

          return (
            <div
              key={product._id}
              onClick={() =>
                navigate(`/shop-ease/product/details/${product._id}`)
              }
              className="min-w-40 snap-center cursor-pointer rounded-lg border border-white/15 bg-transparent p-3 transition-all duration-300 hover:border-white/30 hover:scale-[1.02] flex flex-col h-52"
            >
              {/* IMAGE */}
              {product.image?.base64 ? (
                <img
                  src={`data:${product.image.contentType};base64,${product.image.base64}`}
                  alt={product.title}
                  className="h-30 w-full rounded-md object-contain bg-white/5 hover:scale-105 transition-transform duration-300 flex-1"
                />
              ) : (
                <div className="flex h-30 items-center justify-center rounded-md bg-white/5 text-[10px] text-white/40 flex-1">
                  No Image
                </div>
              )}

              {/* TITLE */}
              <h4 className="mt-2 line-clamp-2 text-xs font-medium text-white leading-tight">
                {product.title}
              </h4>

              {/* TARGET */}
              {product.target && (
                <p className="mt-0.5 text-[10px] text-white/50">
                  {product.target}
                </p>
              )}

              {/* PRICE */}
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold text-white">
                  ₹{discountedPrice}
                </span>

                {product.discount > 0 && (
                  <>
                    <span className="text-[10px] line-through text-white/40">
                      ₹{product.price}
                    </span>
                    <span className="text-[10px] font-medium text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* OFFERS */}
              {product.offers?.length > 0 && (
                <p className="mt-1 text-[10px] text-green-400 line-clamp-1 bg-green-400/5 px-1.5 py-0.5 rounded">
                  {product.offers[0].title}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SimilarProducts;
