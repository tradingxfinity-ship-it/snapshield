"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Check,
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  ZoomIn,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export default function ProductClient({ product }: { product: Product }) {
  const { addItem, toggleWishlist, wishlist } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const stageRef = useRef<HTMLDivElement>(null);
  const wished = wishlist.includes(product.slug);

  // recently viewed
  useEffect(() => {
    try {
      const key = "ss-recent";
      const prev: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      const next = [product.slug, ...prev.filter((s) => s !== product.slug)].slice(0, 6);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [product.slug]);

  const [recent, setRecent] = useState<Product[]>([]);
  useEffect(() => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem("ss-recent") ?? "[]");
      setRecent(
        prev
          .filter((s) => s !== product.slug)
          .map((s) => products.find((p) => p.slug === s))
          .filter(Boolean)
          .slice(0, 4) as Product[]
      );
    } catch {}
  }, [product.slug]);

  const accent = color.hex === "#e5edff" || color.hex === "#f8fafc" ? "#2563EB" : color.hex;

  // product gallery — the finish's slab photo
  const gallery = [product.image];

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 4);
  const fill = related.length < 4 ? products.filter((p) => p.slug !== product.slug && !related.includes(p)).slice(0, 4 - related.length) : [];
  const relatedFinal = [...related, ...fill];

  const onMove = (e: React.MouseEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoom((z) => ({ ...z, x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 }));
  };

  const add = () =>
    addItem(
      { slug: product.slug, name: product.name, price: product.price, color: color.name, accent },
      qty
    );

  return (
    <div className="bg-white pt-[92px]">
      <div className="container-x">
        {/* breadcrumbs */}
        <nav className="flex items-center gap-1.5 py-6 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-brand-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="transition hover:text-brand-600">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="transition hover:text-brand-600">
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-navy">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              ref={stageRef}
              onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
              onMouseMove={onMove}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-slate-100 bg-mist shadow-soft"
            >
              <span className="pointer-events-none absolute right-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-500 backdrop-blur">
                <ZoomIn className="h-3.5 w-3.5" /> Hover to zoom
              </span>
              {product.badge && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
                  {product.badge}
                </span>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={gallery[active]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                    style={{
                      transform: zoom.on ? "scale(1.6)" : undefined,
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* thumbnails */}
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-2xl border-2 bg-mist transition",
                      active === i ? "border-brand-600 shadow-soft" : "border-transparent hover:border-slate-200"
                    )}
                  >
                    <Image src={src} alt="" fill sizes="140px" className="object-cover transition-transform duration-300 hover:scale-105" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* details */}
          <div className="lg:pb-16">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">{product.category}</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg text-slate-600">{product.tagline}</p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-navy">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold tracking-tight text-navy">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <>
                  <span className="text-xl text-slate-400 line-through">{formatPrice(product.compareAt)}</span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                    Save {formatPrice(product.compareAt - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 max-w-lg leading-relaxed text-slate-600">{product.description}</p>

            {/* color selector */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-navy">
                Finish — <span className="text-slate-500">{color.name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-full ring-2 ring-offset-2 transition",
                      color.name === c.name ? "ring-brand-600" : "ring-transparent hover:ring-slate-200"
                    )}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-black/5" style={{ background: c.hex }}>
                      {color.name === c.name && (
                        <Check className={cn("h-4 w-4", c.hex === "#e5edff" || c.hex === "#f8fafc" ? "text-navy" : "text-white")} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* quantity + add */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 rounded-full border border-slate-200 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-mist hover:text-navy"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-bold text-navy">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-mist hover:text-navy"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={add} size="lg" className="flex-1 min-w-[200px]">
                Add to Cart — {formatPrice(product.price * qty)}
              </Button>
              <button
                onClick={() => toggleWishlist(product.slug)}
                aria-label="Wishlist"
                className={cn(
                  "grid h-14 w-14 place-items-center rounded-full border transition",
                  wished ? "border-brand-200 bg-brand-50 text-brand-600" : "border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600"
                )}
              >
                <Heart className={cn("h-5 w-5", wished && "fill-brand-600")} />
              </button>
            </div>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <Sparkles className="h-4 w-4 text-brand-600" /> {product.packSize} · In stock, ships in 1–2 business days
            </p>

            {/* shipping / trust cards */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, t: "Free Shipping", s: "On orders $50+" },
                { icon: ShieldCheck, t: "PSA-Only Fit", s: "0.1mm tolerance" },
                { icon: RefreshCw, t: "30-Day Returns", s: "No-hassle" },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border border-slate-100 bg-mist/60 p-4 text-center">
                  <c.icon className="mx-auto h-5 w-5 text-brand-600" />
                  <p className="mt-2 text-xs font-bold text-navy">{c.t}</p>
                  <p className="text-[11px] text-slate-500">{c.s}</p>
                </div>
              ))}
            </div>

            {/* specifications */}
            <div className="mt-10">
              <h2 className="text-lg font-bold text-navy">Specifications</h2>
              <dl className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100">
                {product.specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
                    <dt className="text-sm text-slate-500">{s.label}</dt>
                    <dd className="text-sm font-semibold text-navy">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* related */}
        <section className="border-t border-slate-100 py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-navy">You may also like</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {relatedFinal.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>

        {/* recently viewed */}
        {recent.length > 0 && (
          <section className="border-t border-slate-100 py-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy">Recently viewed</h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* sticky mobile add-to-cart */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/90 p-4 backdrop-blur-xl lg:hidden">
        <div className="container-x flex items-center gap-3">
          <div>
            <p className="text-lg font-extrabold text-navy">{formatPrice(product.price)}</p>
            <p className="text-xs text-slate-500">{color.name}</p>
          </div>
          <Button onClick={add} size="lg" className="flex-1">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
