import React from "react";
import Header from "../components/Header";
import CompanyDetails from "../components/seller/CompanyDetails";
import SellerProducts from "../components/seller/SellerProducts";

function SellerDashboard() {
  return (
    <>
      <main className="bg-black p-2 space-y-5 w-full">
        <Header />
        <CompanyDetails />
        <SellerProducts />
      </main>
    </>
  );
}

export default SellerDashboard;
