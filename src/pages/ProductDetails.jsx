import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Heart, ShoppingBag } from "lucide-react";
import ProductReviews from "../components/productDetails.jsx/ProductReviews";
import ProductRating from "../components/productDetails.jsx/ProductRating";
import SimilarProducts from "../components/productDetails.jsx/SimilarProducts";
import { useScrollTrigger } from "../utils/useScrollTrigger";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useScrollTrigger();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/market-mate/product/find/${id}`,
          { withCredentials: true }
        );
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const toggleWishlist = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/market-mate/user/wishlist/${product._id}`,
        {},
        { withCredentials: true }
      );

      const isWishlisted = res.data.wishlisted;

      setWishlisted(isWishlisted);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    try {
      setCartLoading(true);
      // eslint-disable-next-line no-unused-vars
      const res = await axios.post(
        `http://localhost:5000/market-mate/user/cart/${product._id}/add`,
        { quantity: 1 },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Add to cart error:", error.response?.data?.message);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        {/* Product Section Skeleton */}
        <section className="w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {/* Image Skeleton */}
          <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-center animate-pulse">
            <div className="w-full h-96 md:h-112.5 bg-linear-to-r from-white/10 via-white/20 to-white/10 rounded-xl" />
          </div>

          {/* Details Skeleton */}
          <div className="flex flex-col gap-6 animate-pulse">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-9 w-4/5 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded-lg" />
              <div className="h-4 w-3/5 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-28 bg-linear-to-r from-green-400/30 via-green-400/50 to-green-400/30 rounded-lg" />
                <div className="h-6 w-20 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
                <div className="h-5 w-16 bg-linear-to-r from-green-400/30 via-green-400/50 to-green-400/30 rounded" />
              </div>
            </div>

            {/* Rating Skeleton */}
            <div className="h-12 bg-white/10 rounded-xl p-3" />

            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
              <div className="h-4 w-5/6 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
              <div className="h-4 w-3/4 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-white/10 rounded-full" />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="flex-1 h-12 bg-linear-to-r from-emerald-500/30 via-emerald-600/50 to-emerald-500/30 rounded-xl" />
              <div className="w-12 h-12 bg-white/10 rounded-xl" />
            </div>
          </div>
        </section>
        {/* Offers & Specs Skeleton */}
        <div className="max-w-6xl mx-auto p-4 space-y-8">
          <div>
            <div className="h-6 w-24 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-white/10 rounded-xl p-4" />
              ))}
            </div>
          </div>

          <div>
            <div className="h-6 w-32 bg-linear-to-r from-white/20 via-white/30 to-white/20 rounded mb-4" />
            <div className="h-80 bg-white/5 border border-white/20 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-black/50 animate-pulse" />{" "}
        {/* Reviews placeholder */}
        <div className="h-80 bg-black/30 animate-pulse" />{" "}
        {/* Similar products placeholder */}
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className=" bg-black text-white p-2 w-full">
        <Header />
        <section className="  w-full h-96 flex items-center justify-center">
          <h1>Product not found.</h1>
        </section>
        <Footer />
      </main>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  return (
    <main className="bg-black text-white min-h-screen p-2">
      <Header />

      {/* PRODUCT SECTION */}
      <section className="w-full mx-auto p-4 lg:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IMAGE */}
        <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-center">
          {product.image ? (
            <img
              src={`data:${product.image.contentType};base64,${product.image.base64}`}
              alt={product.title}
              className="max-h-50 object-contain rounded-xl"
            />
          ) : (
            <div className="text-white/40">No Image Available</div>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-4 space-y-2 justify-center">
          <h1 className="text-3xl font-semibold">{product.title}</h1>

          {/* PRICE */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">
              ₹{Math.round(discountedPrice)}
            </span>

            {product.discount > 0 && (
              <>
                <span className="line-through text-white/40">
                  ₹{product.price}
                </span>
                <span className="text-green-400 text-sm">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* ⭐ RATING DISPLAY + INPUT COMPONENT */}
          <ProductRating
            productId={product._id}
            averageRating={product.averageRating}
          />

          <p className="text-white/70">{product.description}</p>

          {/* TAGS */}
          <div className="flex gap-2 flex-wrap">
            {[product.category, product.subCategory, product.target]
              .filter(Boolean)
              .map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border border-white/20 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={addToCart}
              disabled={cartLoading}
              className="flex-1 px-6 py-1 text-sm rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {cartLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={toggleWishlist}
              className="p-3 rounded-xl border border-white/30 hover:bg-white/10"
            >
              {wishlisted ? (
                "wishlisted"
              ) : (
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      {product.offers?.length > 0 && (
        <section className="max-w-full mx-auto p-4">
          <h2 className="text-xl mb-3">Offers</h2>
          <div className="space-y-2">
            {product.offers.map((offer, i) => (
              <div key={i} className="border border-white/20 rounded-xl p-3">
                <span className="font-medium">{offer.title}</span>
                {offer.discount && (
                  <span className="ml-2 text-green-400">{offer.discount}%</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SPECS */}
      {product.specs?.length > 0 && (
        <section className="max-w-full mx-auto p-4">
          <h2 className="text-xl mb-3">Specifications</h2>
          <div className="border border-white/20 rounded-xl divide-y divide-white/10">
            {product.specs.map((spec, i) => (
              <div key={i} className="flex justify-between p-3 text-white/70">
                <span>{spec.key}</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <ProductReviews productId={product._id} />
      <SimilarProducts
        productId={product._id}
        category={product.category}
        subCategory={product.subCategory}
      />

      <Footer />
    </main>
  );
}

export default ProductDetails;
