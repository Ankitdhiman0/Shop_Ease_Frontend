import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function SellerDescription() {
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgreeAndContinue = () => {
    if (!isAgreed) return;
    navigate("/market-mate/seller/company/register");
  };

  return (
    <div className="w-full bg-black text-white min-h-screen p-2">
      <Header />
      <div className="p-8 max-w-4xl mx-auto">
        {/* pt-24 for header space */}
        <h1 className="text-3xl font-bold mb-8 border-b border-white/20 pb-6">
          Seller Terms & Responsibilities
        </h1>
        <div className="space-y-8 text-sm leading-relaxed">
          {/* Terms & Conditions */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">
              Terms & Conditions
            </h2>
            <ul className="space-y-3 text-gray-300 list-disc pl-6">
              <li>
                All products must be accurately described with correct
                specifications, condition, and pricing.
              </li>
              <li>
                Sellers are responsible for product quality and must ensure
                items match listing descriptions.
              </li>
              <li>
                Prohibited items include counterfeit goods, illegal products,
                and hazardous materials.
              </li>
              <li>
                Payment processing fees are deducted automatically; payouts
                occur weekly after order confirmation.
              </li>
              <li>
                Listings violating platform policies will be removed without
                notice.
              </li>
              <li>
                Sellers agree to 7-day return policy for defective or
                misrepresented items.
              </li>
            </ul>
          </section>

          {/* Seller Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">
              Seller Responsibilities
            </h2>
            <ul className="space-y-3 text-gray-300 list-disc pl-6">
              <li>
                <strong>Shipping:</strong> Ship orders within 48 hours of
                payment confirmation using tracked services.
              </li>
              <li>
                <strong>Customer Service:</strong> Respond to buyer inquiries
                within 24 hours.
              </li>
              <li>
                <strong>Inventory Management:</strong> Maintain accurate stock
                levels to prevent overselling.
              </li>
              <li>
                <strong>Product Images:</strong> Upload high-quality, original
                photos (no stock images).
              </li>
              <li>
                <strong>Packaging:</strong> Use proper packaging to prevent
                damage during transit.
              </li>
              <li>
                <strong>Dispute Resolution:</strong> Cooperate with platform
                mediation for buyer disputes.
              </li>
              <li>
                <strong>Compliance:</strong> Follow all local tax laws and
                provide accurate business information.
              </li>
            </ul>
          </section>

          {/* Agreement Checkbox */}
          <div className="pt-8 border-t border-white/10">
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 rounded border-white/50 focus:ring-white/70 bg-black checked:bg-white checked:border-white transition-all duration-200"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span className="text-sm text-gray-300 leading-relaxed">
                I have read and agree to the <strong>Terms & Conditions</strong>{" "}
                and <strong>Seller Responsibilities</strong> above.
              </span>
            </label>

            <button
              onClick={handleAgreeAndContinue}
              className={`w-full px-8 py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isAgreed
                  ? "bg-white text-black hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                  : "bg-white/30 text-white/60 cursor-not-allowed hover:scale-100"
              }`}
              disabled={!isAgreed}
            >
              {isAgreed ? "✅ I Agree & Continue" : "Please agree to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDescription;
