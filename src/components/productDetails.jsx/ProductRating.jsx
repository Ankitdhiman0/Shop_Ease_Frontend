import React from "react";

function ProductRating({ averageRating = 0 }) {
  const rating = Math.max(0, Math.min(5, averageRating));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-yellow-500 text-lg leading-none">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`}>★</span>
        ))}

        {hasHalfStar && <span className="opacity-60">★</span>}

        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">
            ★
          </span>
        ))}
      </div>

      <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

export default ProductRating;
