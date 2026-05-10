import { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("omindiCart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("omindiCart", JSON.stringify(cartItems));
    } catch {
      // ignore storage failures
    }
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id
            ? { ...entry, quantity: (entry.quantity || 0) + quantity }
            : entry,
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((current) => current.filter((entry) => entry.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, quantity: quantity > 0 ? quantity : entry.quantity }
          : entry,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + (entry.quantity || 0), 0),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
