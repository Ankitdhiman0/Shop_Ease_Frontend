import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/product/find/${productId}`);
        setReviews(res.data.product.reviews || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [productId]);

  const submitReview = async () => {
    if (!rating || !comment.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(`/product/${productId}/review`, {
        rating,
        comment,
      });
      setReviews(res.data.reviews);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-full mx-auto p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-8 bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent">
        Customer Reviews
      </h2>

      {/* COMPACT REVIEW FORM */}
      <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 hover:border-white/40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 transition-all ${
                  star <= rating
                    ? "text-yellow-400 scale-110"
                    : "text-white/30 hover:text-yellow-400"
                }`}
              >
                <FiStar size={20} />
              </button>
            ))}
          </div>
          <span className="text-sm font-medium text-white/70">
            {rating || 0}/5
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-sm placeholder-white/40 focus:border-white/50 focus:outline-none transition-all resize-none"
          maxLength={500}
        />

        {/* UPDATE NOTICE */}
        <p className="text-xs text-white/60 mt-2 mb-4 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
          💡 Already reviewed? Submit a new review to update your previous one
          automatically.
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-white/50">{comment.length}/500</span>
          <button
            onClick={submitReview}
            disabled={loading || !rating || !comment.trim()}
            className="px-6 py-2 bg-linear-to-r from-white to-gray-100 text-black font-semibold rounded-xl hover:from-gray-100 hover:to-white active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post Review"}
          </button>
        </div>
      </div>

      {/* HORIZONTAL REVIEWS SCROLL */}
      {reviews.length > 0 ? (
        <div className="w-full overflow-hidden">
          <div className="flex gap-6 pb-2 scrollbar-hide overflow-x-auto snap-x snap-mandatory scroll-smooth">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="flex-none   group bg-black/40 backdrop-blur-md border border-white/15 rounded-xl p-6 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl snap-center flex flex-col"
              >
                <div className="flex items-start justify-between mb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-white/20 to-transparent rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-white/90">
                        {r.user?.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white truncate group-hover:text-white/90">
                        {r.user?.name || "Anonymous"}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-0.5">
                          {Array(r.rating)
                            .fill(0)
                            .map((_, j) => (
                              <FiStar
                                key={j}
                                size={16}
                                className="text-yellow-400 fill-yellow-400 shrink-0"
                              />
                            ))}
                        </div>
                        <span className="text-xs text-white/60 ml-1">
                          ({r.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-white/40 font-medium whitespace-nowrap shrink-0 ml-4">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* FIXED: Proper paragraph wrapping */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide text-white/85 leading-relaxed pr-2 wrap-break-word">
                  {r.comment}
                </div>
              </div>
            ))}
          </div>

          {/* SNAP INDICATORS */}
          {reviews.length > 3 && (
            <div className="flex gap-2 mt-4 justify-center">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === 0 ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                  }`}
                  onClick={() => {
                    const container = document.querySelector(".scroll-smooth");
                    container.scrollTo({
                      left: i * 320,
                      behavior: "smooth",
                    });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar size={24} className="text-white/30" />
          </div>
          <h3 className="text-xl font-semibold text-white/70 mb-2">
            No reviews yet
          </h3>
          <p className="text-white/50 mb-6">
            Be the first to share your experience
          </p>
          <p className="text-sm text-white/40">
            Your review helps other shoppers
          </p>
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
