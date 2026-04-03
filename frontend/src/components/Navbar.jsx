import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, ShoppingBag, Sun, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useCustomer } from "../context/CustomerContext";
import { useAdmin } from "../context/AdminContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { customer } = useCustomer();
  const { admin } = useAdmin();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/shop", label: t.nav.shop },
    { to: "/contact", label: t.nav.contact },
    { to: "/account", label: customer ? t.nav.account : t.nav.register }
  ];

  if (admin) {
    links.push({ to: "/admin/dashboard", label: t.nav.admin });
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? "border-black/5 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-ink/75"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl font-extrabold tracking-tight">
          Premium Tee
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-ember ${isActive ? "text-ember" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-black/10 p-2 dark:border-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/cart" className="relative rounded-full border border-black/10 p-2 dark:border-white/10">
            <ShoppingBag size={18} />
            <span className="absolute -right-1 -top-1 rounded-full bg-ember px-1.5 text-[10px] font-bold text-white">
              {cart.length}
            </span>
          </Link>
          {admin ? (
            <Link to="/admin/dashboard" className="hidden rounded-full border border-black/10 p-2 dark:border-white/10 md:block">
              <User size={18} />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-black/10 p-2 dark:border-white/10 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="section-shell pb-4 md:hidden"
          >
            <div className="glass-panel space-y-3 rounded-3xl p-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
