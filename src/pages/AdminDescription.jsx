import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDescription() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) return;
    navigate("/market-mate/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white flex justify-center items-center px-4">
      <section className="max-w-8xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide">
          Admin Access Agreement
        </h1>

        {/* WHO IS ADMIN */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Who is an Admin?</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            An admin is a trusted authority responsible for maintaining platform
            integrity, data accuracy, and user safety. Admin access grants
            elevated permissions that directly affect the system and its users.
          </p>
        </div>

        {/* ADMIN ROLES */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Admin Roles & Powers</h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Create, update, and delete products</li>
            <li>Manage product pricing, inventory, and visibility</li>
            <li>Create and update homepage carousel banners</li>
            <li>Attach product links to carousel images</li>
            <li>Review and moderate user-generated content</li>
            <li>Delete or restrict users violating platform policies</li>
          </ul>
        </div>

        {/* RESPONSIBILITIES */}
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">
            Responsibilities & Accountability
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Admins must act responsibly. Any misuse of admin privileges,
            including unauthorized deletion, manipulation of data, or abuse of
            power, may result in immediate access revocation and legal action if
            applicable.
          </p>
        </div>

        {/* TERMS */}
        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 accent-white"
            />
            <span className="text-sm text-gray-300 leading-relaxed">
              I acknowledge that I understand my role as an admin, accept full
              responsibility for my actions, and agree to follow all platform
              rules, security guidelines, and terms of service.
            </span>
          </label>
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!accepted}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition
              ${
                accepted
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-600 text-black cursor-not-allowed"
              }`}
          >
            Proceed to Admin Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}

export default AdminDescription;
