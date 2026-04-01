import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("premium-cart") || "[]"));

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("premium-cart", JSON.stringify(next));
  };

  const addToCart = (product, size, qty = 1) => {
    const next = [...cart];
    const index = next.findIndex((item) => item.id === product.id && item.size === size);

    if (index >= 0) {
      next[index].qty += qty;
    } else {
      next.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        qty
      });
    }

    persist(next);
  };

  const updateQty = (id, size, qty) => {
    if (qty <= 0) {
      return removeItem(id, size);
    }
    persist(cart.map((item) => (item.id === id && item.size === size ? { ...item, qty } : item)));
  };

  const removeItem = (id, size) => persist(cart.filter((item) => !(item.id === id && item.size === size)));
  const clearCart = () => persist([]);

  const value = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return { cart, subtotal, addToCart, updateQty, removeItem, clearCart };
  }, [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
