import axios from "../../utils/AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function CompanyDetails() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompanyDetails = async () => {
      try {
        const res = await axios.get(`/user/company/details`);
        setCompany(res.data.company);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getCompanyDetails();
  }, []);

  const handleUpdateNavigate = () => {
    navigate("/market-mate/seller/company/register");
  };

  const handleNewProductNavigate = () => {
    navigate("/market-mate/seller/product/register");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto flex items-center justify-center border-2 border-dashed border-white/20 rounded-xl mb-4">
            <span className="text-xs uppercase tracking-[0.2em] text-white/30">
              No
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight mb-2">
            No Company Found
          </h1>
          <p className="text-sm text-white/40">
            Register your brand to get started selling.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black text-white">
      <section className="max-w-full mx-auto">
        <div className="border border-white/10 bg-black/70 backdrop-blur-sm rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.06)]">
          {/* Header with Buttons */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Brand Profile
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpdateNavigate}
                className="text-xs uppercase tracking-[0.18em] font-medium border border-white/30 px-4 py-1.5 rounded-lg hover:bg-white hover:text-black hover:border-white transition-all duration-200 flex items-center gap-1"
              >
                Edit
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5h3m1.5-3h3"
                  />
                </svg>
              </button>
              <button
                onClick={handleNewProductNavigate}
                className="text-xs uppercase tracking-[0.18em]  bg-linear-to-r from-emerald-500/90 to-emerald-600/90 px-4 py-[1.2vw] rounded-md hover:from-emerald-400 hover:to-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                Product
              </button>
            </div>
          </div>

          {/* Logo & Name */}
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-white/10">
            {company.logo ? (
              <div className="w-24 h-24 shrink-0 rounded-xl border-2 border-white/15 overflow-hidden bg-black/50">
                <img
                  src={`data:${company.contentType};base64,${company.logo}`}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 shrink-0 border-2 border-dashed border-white/20 rounded-xl bg-black/30 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                  No Logo
                </span>
              </div>
            )}

            <div className="flex flex-col min-w-0 justify-between">
              <h2 className="text-xl font-bold tracking-tight leading-tight truncate">
                {company.name}
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">
                Verified Seller
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.18em] text-white/50 block">
                Description
              </span>
              <p className="text-white/85 text-sm leading-relaxed">
                {company.description || "No description provided."}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.18em] text-white/50 block">
                Address
              </span>
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-white/40 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-white/80 text-sm">
                  {company.address || "No address provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompanyDetails;
