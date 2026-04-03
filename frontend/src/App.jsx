import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ContactPage from "./pages/ContactPage";
import AccountPage from "./pages/AccountPage";
import AdminLoginPage from "./admin/AdminLoginPage";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <div className="min-h-screen bg-sand dark:bg-ink">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
