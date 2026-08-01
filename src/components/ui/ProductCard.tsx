"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { shopImages } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import SlabVisual from "./SlabVisual";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const wished = wishlist.includes(product.slug);
  const photo = shopImages[product.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-4xl border border-slate-100 bg-gradient-to-b from-white to-mist shadow-soft transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-premium"
      >
        {product.badge && (
          <span
            className={cn(
              "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur",
              product.bestSeller
                ? "bg-brand-600 text-white shadow-glow"
                : "bg-white/80 text-navy ring-1 ring-slate-200"
            )}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label="Add to wishlist"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 backdrop-blur transition hover:scale-110 hover:text-brand-600"
        >
          <Heart className={cn("h-4 w-4 transition", wished && "fill-brand-600 text-brand-600")} />
        </button>

        <div className="relative aspect-[4/5] overflow-hidden">
          {photo ? (
            <>
              <Image
                src={photo.src}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
              />
              <Image
                src={photo.hover}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                className="scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
              />
            </>
          ) : (
            <>
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(120% 80% at 50% 0%, ${product.accent}22, transparent 60%)` }}
              />
              <div className="flex h-full w-full items-center justify-center p-8">
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2">
                  <SlabVisual accent={product.accent} guard={product.colors[0].hex} id={`card-${product.slug}`} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* quick add */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                color: product.colors[0].name,
                accent: product.accent,
              });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-navy py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600"
          >
            <Plus className="h-4 w-4" /> Quick Add
          </button>
        </div>
      </Link>

      <div className="mt-5 px-1">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/product/${product.slug}`} className="text-lg font-bold tracking-tight text-navy hover:text-brand-600">
            {product.name}
          </Link>
          <div className="flex items-center gap-1 text-sm font-semibold text-navy">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {product.rating}
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-500">{product.tagline}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-navy">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(product.compareAt)}</span>
          )}
          <span className="ml-auto flex gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-slate-200"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
