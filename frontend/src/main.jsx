import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AdminProvider } from "./context/AdminContext";
import { CustomerProvider } from "./context/CustomerContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <ThemeProvider>
            <AdminProvider>
              <CustomerProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </CustomerProvider>
            </AdminProvider>
          </ThemeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
