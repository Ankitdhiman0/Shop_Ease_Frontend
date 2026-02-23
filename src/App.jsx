import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";
import SearchResult from "./pages/SearchResult";
import Login from "./pages/Login";
import AdminDescription from "./pages/AdminDescription";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDescription from "./pages/SellerDescription";
import SellerCompanyRegister from "./pages/SellerCompanyRegister";
import SellerDashboard from "./pages/SellerDashboard";
import RegisterProduct from "./pages/RegisterProduct";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetails from "./pages/ProductDetails";
import WishListPage from "./pages/WishListPage";
import Cart from "./pages/Cart";
import RegisterAddress from "./pages/RegisterAddress";
import AddressesPage from "./pages/AddressesPage";
import OrderSummary from "./pages/OrderSummary";
import OrdersPage from "./pages/OrdersPage";
import UserAccount from "./pages/UserAccount";
import Account from "./components/admin/Account";
import UpdateAccount from "./components/admin/UpdateAccount";
import ProductsPage from "./components/admin/ProductsPage";
import AdminOrders from "./components/admin/AdminOrders";

function App() {
  return (
    <Router>
      <Routes>
        {/* SHOP-EASE PARENT */}
        <Route path="/shop-ease">
          {/* INDEX → LOGIN */}
          <Route index element={<Login />} />
          {/* OPTIONAL: explicit login path */}
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="register" element={<RegisterUser />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="search" element={<SearchResult />} />
          <Route path="user/wishlist" element={<WishListPage />} />
          <Route path="user/cart" element={<Cart />} />
          <Route path="user/addresses" element={<AddressesPage />} />
          <Route path="user/address/register" element={<RegisterAddress />} />
          <Route path="product/details/:id" element={<ProductDetails />} />
          <Route path="seller/description" element={<SellerDescription />} />
          <Route
            path="seller/company/register"
            element={<SellerCompanyRegister />}
          />

          <Route path="order/summary" element={<OrderSummary />} />
          <Route path="user/orders" element={<OrdersPage />} />
          <Route path="seller/dashboard" element={<SellerDashboard />} />
          <Route path="seller/product/register" element={<RegisterProduct />} />
          <Route path="seller/product/update/:id" element={<UpdateProduct />} />
          <Route path="admin/description" element={<AdminDescription />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/account" element={<Account />} />
          <Route path="admin/account/update" element={<UpdateAccount />} />
          <Route path="admin/products" element={<ProductsPage />} />
          <Route path="admin/users/:id/orders" element={<AdminOrders />} />
        </Route>

        {/* OPTIONAL ROOT REDIRECT */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
