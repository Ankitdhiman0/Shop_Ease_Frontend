import React from "react";
import { useNavigate } from "react-router-dom";
import { popularCategories } from "../../data/popularCategories";

function ExplorePopularCategories() {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-[3vh] font-semibold text-white">
          Popular Categories
        </h2>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
        <div className="flex gap-6 pb-4">
          {popularCategories.map((cat) => (
            <div
              key={cat.category}
              className="group relative w-72 h-38 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black snap-center"
              style={{ scrollSnapAlign: "start" }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 will-change-transform"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-500 ease-out" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                  {cat.name}
                </h3>

                <button
                  onClick={() =>
                    navigate(
                      `/market-mate/search?query=${encodeURIComponent(
                        cat.category.toLocaleLowerCase().trim()
                      )}`
                    )
                  }
                  className="w-fit px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl  active:translate-y-0 will-change-transform"
                >
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExplorePopularCategories;
