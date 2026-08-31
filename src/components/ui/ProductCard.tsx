"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import SlabVisual from "./SlabVisual";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.slug);
  const photo = product.image || null;
  const finish = product.colors[0];
  const off =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/product/${product.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-premium"
      >
        {/* ---- image stage ---- */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-mist to-white">
          {/* finish glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(90% 60% at 50% 12%, ${product.accent}1f, transparent 62%)` }}
          />

          {/* badges */}
          <div className="absolute left-3.5 top-3.5 z-10 flex flex-col items-start gap-1.5">
            {product.badge && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider backdrop-blur",
                  product.bestSeller
                    ? "bg-brand-600 text-white shadow-glow"
                    : "bg-white/85 text-navy ring-1 ring-slate-200"
                )}
              >
                {product.badge}
              </span>
            )}
            {off > 0 && (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-sm">
                −{off}%
              </span>
            )}
          </div>

          {/* wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.slug);
            }}
            aria-label="Add to wishlist"
            className="absolute right-3.5 top-3.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-slate-500 backdrop-blur transition hover:scale-110 hover:text-brand-600"
          >
            <Heart className={cn("h-4 w-4 transition", wished && "fill-brand-600 text-brand-600")} />
          </button>

          {/* rating pill */}
          <span className="absolute bottom-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy shadow-sm backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>

          {/* image / fallback */}
          {photo ? (
            <Image
              src={photo}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-8">
              <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2">
                <SlabVisual accent={product.accent} guard={finish.hex} id={`card-${product.slug}`} />
              </div>
            </div>
          )}
        </div>

        {/* ---- info footer ---- */}
        <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
          <div className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white"
              style={{ background: finish.hex, boxShadow: `0 0 0 1px ${product.accent}55` }}
              title={finish.name}
            />
            <h3 className="truncate text-[15px] font-bold tracking-tight text-navy transition-colors group-hover:text-brand-600">
              {product.name}
            </h3>
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] text-slate-500">{product.tagline}</p>

          <div className="mt-3.5 flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-navy">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(product.compareAt)}</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  color: finish.name,
                  accent: product.accent,
                });
              }}
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-navy px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
