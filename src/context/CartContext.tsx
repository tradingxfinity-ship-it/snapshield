"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  color: string;
  accent: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  subtotal: number;
  wishlist: string[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (slug: string, color: string) => void;
  updateQty: (slug: string, color: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleWishlist: (slug: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const FREE_SHIP_THRESHOLD = 50;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem("ss-cart");
      const w = localStorage.getItem("ss-wishlist");
      if (c) setItems(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem("ss-cart", JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem("ss-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === item.slug && p.color === item.color);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  };

  const removeItem: CartContextValue["removeItem"] = (slug, color) =>
    setItems((prev) => prev.filter((p) => !(p.slug === slug && p.color === color)));

  const updateQty: CartContextValue["updateQty"] = (slug, color, qty) =>
    setItems((prev) =>
      prev
        .map((p) => (p.slug === slug && p.color === color ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );

  const clearCart: CartContextValue["clearCart"] = () => setItems([]);

  const toggleWishlist: CartContextValue["toggleWishlist"] = (slug) =>
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
    return {
      items,
      isOpen,
      count,
      subtotal,
      wishlist,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleWishlist,
    };
  }, [items, isOpen, wishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { FREE_SHIP_THRESHOLD };
