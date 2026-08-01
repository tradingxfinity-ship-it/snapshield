"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products, categories, shopImages } from "@/lib/products";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/shop", mega: true },
  { label: "Best Sellers", href: "/shop?filter=best" },
  { label: "Why Snap Shield", href: "/#why" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const { count, openCart, wishlist } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
        onMouseLeave={() => setMega(false)}
      >
        <div
          className={cn(
            "bg-[#0b1e40] transition-all duration-500",
            scrolled ? "shadow-lg shadow-navy/40 ring-1 ring-white/5" : ""
          )}
        >
          <nav className="container-x flex h-[68px] items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Snap Shield home">
              <Image
                src="/logo-mark.png"
                alt="Snap Shield"
                width={38}
                height={52}
                priority
                className="h-11 w-auto object-contain"
              />
              <span className="text-lg font-extrabold tracking-tight text-white">
                SNAP<span className="text-brand-400">SHIELD</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((l) => (
                <div
                  key={l.label}
                  onMouseEnter={() => setMega(!!l.mega)}
                  className="relative"
                >
                  <Link
                    href={l.href}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-blue-100 transition hover:bg-white/10 hover:text-white"
                  >
                    {l.label}
                    {l.mega && <ChevronDown className="h-3.5 w-3.5" />}
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                aria-label="Search"
                onClick={() => setSearch(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <Link
                href="/shop"
                aria-label="Wishlist"
                className="relative hidden h-10 w-10 place-items-center rounded-full text-blue-100 transition hover:bg-white/10 hover:text-white sm:grid"
              >
                <Heart className="h-[18px] w-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-600" />
                )}
              </Link>
              <button
                aria-label="Cart"
                onClick={openCart}
                className="relative grid h-10 w-10 place-items-center rounded-full text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <button
                aria-label="Menu"
                onClick={() => setMobile(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>

        {/* Mega menu */}
        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 hidden lg:block"
            >
              <div className="container-x">
                <div className="glass overflow-hidden rounded-3xl border border-white/60 shadow-premium">
                  <div className="grid grid-cols-4 gap-6 p-8">
                    <div className="col-span-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Collections</p>
                      <ul className="mt-4 space-y-1">
                        {categories.map((c) => (
                          <li key={c}>
                            <Link
                              href={`/shop?category=${encodeURIComponent(c)}`}
                              className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-navy"
                            >
                              {c}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-4">
                      {products.slice(0, 3).map((p) => (
                        <Link
                          key={p.slug}
                          href={`/product/${p.slug}`}
                          className="group rounded-2xl border border-white/70 bg-white/60 p-4 transition hover:-translate-y-1 hover:shadow-soft"
                        >
                          <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-mist">
                            {shopImages[p.slug] ? (
                              <Image
                                src={shopImages[p.slug].src}
                                alt={p.name}
                                fill
                                sizes="240px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${p.accent}, #0f172a)` }} />
                            )}
                          </div>
                          <p className="text-sm font-bold text-navy">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.tagline}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search overlay */}
      <SearchOverlay open={search} onClose={() => setSearch(false)} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobile(false)}
              className="fixed inset-0 z-[60] bg-navy/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[70] w-[86%] max-w-sm bg-white p-6 shadow-premium lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Image src="/logo-full.png" alt="Snap Shield" width={140} height={63} className="h-9 w-auto object-contain" />
                <button onClick={() => setMobile(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setMobile(false)}
                    className="rounded-2xl px-4 py-3.5 text-lg font-bold text-navy transition hover:bg-mist"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Shop by category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(1).map((c) => (
                    <Link
                      key={c}
                      href={`/shop?category=${encodeURIComponent(c)}`}
                      onClick={() => setMobile(false)}
                      className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = q
    ? products.filter((p) => (p.name + p.tagline + p.category).toLowerCase().includes(q.toLowerCase()))
    : products.slice(0, 4);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-navy/30 p-4 backdrop-blur-md sm:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="mt-16 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-premium"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-5">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search guards, cases, bundles…"
                className="h-16 flex-1 bg-transparent text-lg text-navy outline-none placeholder:text-slate-400"
              />
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-3">
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-2xl p-3 transition hover:bg-mist"
                >
                  <span
                    className="h-12 w-12 shrink-0 rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${p.accent}, #0f172a)` }}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-navy">{p.name}</span>
                    <span className="block text-xs text-slate-500">{p.tagline}</span>
                  </span>
                  <span className="text-sm font-bold text-brand-600">${p.price}</span>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="p-6 text-center text-sm text-slate-500">No results for “{q}”.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
