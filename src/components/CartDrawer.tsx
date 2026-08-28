"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck, X, Lock, Apple } from "lucide-react";
import { useCart, FREE_SHIP_THRESHOLD } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "./ui/Button";
import Link from "next/link";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQty, removeItem, subtotal, addItem } = useCart();
  const products = useProducts();

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const upsells = products.filter((p) => !items.some((i) => i.slug === p.slug)).slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-navy/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col bg-white shadow-premium"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-navy">
                <ShoppingBag className="h-5 w-5 text-brand-600" /> Your Cart
              </h2>
              <button onClick={closeCart} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* free shipping bar */}
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Truck className="h-4 w-4 text-brand-600" />
                {remaining > 0 ? (
                  <>You&apos;re {formatPrice(remaining)} away from free shipping</>
                ) : (
                  <span className="font-semibold text-brand-600">You&apos;ve unlocked free shipping!</span>
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-brand-gradient"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-mist">
                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="mt-4 text-lg font-bold text-navy">Your cart is empty</p>
                  <p className="mt-1 text-sm text-slate-500">Protect your grails — start with a best seller.</p>
                  <button onClick={closeCart} className="mt-6">
                    <ButtonLink href="/shop" size="sm">Browse Shop</ButtonLink>
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <motion.li
                      key={item.slug + item.color}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 rounded-2xl border border-slate-100 p-3"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="grid h-20 w-16 shrink-0 place-items-center rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${item.accent}, #0f172a)` }}
                      >
                        <ShoppingBag className="h-5 w-5 text-white/70" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <p className="text-sm font-bold text-navy">{item.name}</p>
                          <button onClick={() => removeItem(item.slug, item.color)} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500">{item.color}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-slate-200">
                            <button
                              onClick={() => updateQty(item.slug, item.color, item.qty - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:text-navy"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.slug, item.color, item.qty + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:text-navy"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-navy">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}

              {/* upsells */}
              {items.length > 0 && upsells.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">You may also like</p>
                  <div className="space-y-2">
                    {upsells.map((p) => (
                      <div key={p.slug} className="flex items-center gap-3 rounded-2xl bg-mist p-3">
                        <span className="h-11 w-9 shrink-0 rounded-lg" style={{ background: `linear-gradient(135deg, ${p.accent}, #0f172a)` }} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-navy">{p.name}</p>
                          <p className="text-xs text-slate-500">{formatPrice(p.price)}</p>
                        </div>
                        <button
                          onClick={() =>
                            addItem({ slug: p.slug, name: p.name, price: p.price, color: p.colors[0].name, accent: p.accent })
                          }
                          className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white transition hover:bg-brand-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-slate-100 px-6 py-5">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-lg font-extrabold text-navy">{formatPrice(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Taxes and shipping calculated at checkout.</p>
                <button onClick={closeCart} className="mt-4 block w-full">
                  <ButtonLink href="/checkout" size="lg" className="w-full">
                    <Lock className="h-4 w-4" /> Secure Checkout
                  </ButtonLink>
                </button>
                {/* accepted payment methods */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-extrabold italic">
                    <span className="text-[#003087]">Pay</span>
                    <span className="text-[#009cde]">Pal</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[10px] font-semibold text-navy">
                    <Apple className="h-3 w-3 fill-navy" /> Pay
                  </span>
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Visa</span>
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">MC</span>
                  <span className="rounded-md border border-slate-200 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">Amex</span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
