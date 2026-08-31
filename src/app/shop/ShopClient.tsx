"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Shield,
  Home,
  Package,
  Briefcase,
  Sparkles,
  Layers,
  Award,
  Tag,
  Check,
  ArrowLeft,
  ArrowRight,
  Heart,
  Plus,
} from "lucide-react";
import { categories } from "@/lib/products";
import { useProducts, useShopImages } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, cn } from "@/lib/utils";
import SlabVisual from "@/components/ui/SlabVisual";

const catIcons: Record<string, typeof Home> = {
  "Slab Guards": Shield,
  Display: Home,
  Bundles: Package,
  Cases: Briefcase,
  Care: Sparkles,
};

export default function ShopClient() {
  const params = useSearchParams();
  const products = useProducts();
  const shopImages = useShopImages();
  const initialCat = params.get("category") ?? "All";

  const [category, setCategory] = useState(categories.includes(initialCat) ? initialCat : "All");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    new: false,
    best: params.get("filter") === "best",
    discount: false,
  });

  // banner slideshow
  const slides = ["/shop-banner-1.png", "/shop-banner-2.png", "/shop-banner-3.png"];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { addItem, toggleWishlist, wishlist } = useCart();

  const list = useMemo(() => {
    let l = [...products];
    if (category !== "All") l = l.filter((p) => p.category === category);
    if (query) l = l.filter((p) => (p.name + p.tagline + p.category).toLowerCase().includes(query.toLowerCase()));
    if (filters.new) l = l.filter((p) => p.badge === "New");
    if (filters.best) l = l.filter((p) => p.bestSeller);
    if (filters.discount) l = l.filter((p) => p.compareAt);
    return l;
  }, [category, query, filters]);

  return (
    <div className="bg-white">
      {/* ---------- full-bleed banner slideshow ---------- */}
      <div className="relative h-[360px] w-full overflow-hidden sm:h-[480px]">
        {slides.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === slide ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ scale: i === slide ? 1.12 : 1 }}
              transition={{ duration: i === slide ? 5.5 : 0.8, ease: "easeOut" }}
            >
              <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover object-center" />
            </motion.div>
          </motion.div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-navy/10" />
      </div>

      {/* overlapping search card */}
      <div className="container-x">
        <div className="relative z-10 -mt-14 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-premium sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy">Everything your grails need</h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-4 pr-1.5 sm:w-[380px]"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Snap Shield…"
              className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[240px_1fr] lg:py-16">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-display text-lg font-bold text-navy">Category</p>

          <div className="mt-4 space-y-1">
            <button
              onClick={() => setCategory("All")}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                category === "All" ? "bg-mist text-navy" : "text-slate-600 hover:bg-mist/60"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="h-4 w-4" /> All Product
              </span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white">
                {products.length}
              </span>
            </button>

            <div className="ml-4 space-y-0.5 border-l border-slate-100 pl-3">
              {categories.slice(1).map((cat) => {
                const Icon = catIcons[cat] ?? Package;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                      category === cat ? "bg-mist text-navy" : "text-slate-500 hover:bg-mist/60 hover:text-navy"
                    )}
                  >
                    <Icon className="h-4 w-4" /> {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* filters */}
          <div className="mt-6 space-y-1 border-t border-slate-100 pt-6">
            <FilterRow icon={Sparkles} label="New Arrival" active={filters.new} onClick={() => setFilters((f) => ({ ...f, new: !f.new }))} />
            <FilterRow icon={Award} label="Best Seller" active={filters.best} onClick={() => setFilters((f) => ({ ...f, best: !f.best }))} />
            <FilterRow icon={Tag} label="On Discount" active={filters.discount} onClick={() => setFilters((f) => ({ ...f, discount: !f.discount }))} />
          </div>
        </aside>

        {/* product grid */}
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => {
              const photo = shopImages[p.slug];
              const wished = wishlist.includes(p.slug);
              const finish = p.colors[0];
              const off = p.compareAt && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-premium"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-mist to-white">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(90% 60% at 50% 12%, ${p.accent}1f, transparent 62%)` }}
                    />

                    <div className="absolute left-3.5 top-3.5 z-10 flex flex-col items-start gap-1.5">
                      {p.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider backdrop-blur",
                            p.bestSeller ? "bg-brand-600 text-white shadow-glow" : "bg-white/85 text-navy ring-1 ring-slate-200"
                          )}
                        >
                          {p.badge}
                        </span>
                      )}
                      {off > 0 && (
                        <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-sm">
                          −{off}%
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleWishlist(p.slug)}
                      aria-label="Add to wishlist"
                      className="absolute right-3.5 top-3.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-slate-500 backdrop-blur transition hover:scale-110 hover:text-brand-600"
                    >
                      <Heart className={cn("h-4 w-4 transition", wished && "fill-brand-600 text-brand-600")} />
                    </button>

                    <span className="absolute bottom-3.5 left-3.5 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy shadow-sm backdrop-blur">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {p.rating} <span className="font-medium text-slate-400">({p.reviewCount.toLocaleString()})</span>
                    </span>

                    <Link href={`/product/${p.slug}`} className="block h-full w-full">
                      {photo ? (
                        <Image
                          src={photo.src}
                          alt={p.name}
                          fill
                          sizes="(max-width:640px) 100vw, 300px"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center p-6">
                          <SlabVisual accent={p.accent} guard={finish.hex} id={`shop-${p.slug}`} />
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="flex flex-1 flex-col border-t border-slate-100 p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-white"
                        style={{ background: finish.hex, boxShadow: `0 0 0 1px ${p.accent}55` }}
                        title={finish.name}
                      />
                      <Link href={`/product/${p.slug}`} className="truncate text-[15px] font-bold tracking-tight text-navy transition-colors hover:text-brand-600">
                        {p.name}
                      </Link>
                      <span className="ml-auto flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold text-navy">{formatPrice(p.price)}</span>
                        {p.compareAt && <span className="text-xs text-slate-400 line-through">{formatPrice(p.compareAt)}</span>}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-[13px] text-slate-500">{p.tagline}</p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          addItem({ slug: p.slug, name: p.name, price: p.price, color: finish.name, accent: p.accent })
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 active:scale-[0.98]"
                      >
                        <Plus className="h-4 w-4" /> Add to Cart
                      </button>
                      <Link
                        href={`/product/${p.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-navy transition hover:border-navy hover:bg-mist"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {list.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-lg font-bold text-navy">No products match your filters.</p>
              <button
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                  setFilters({ new: false, best: false, discount: false });
                }}
                className="mt-3 text-sm font-semibold text-brand-600"
              >
                Reset filters
              </button>
            </div>
          )}

          {/* pagination */}
          {list.length > 0 && (
            <div className="mt-14 flex items-center justify-between border-t border-slate-100 pt-8">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-navy">
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              <div className="flex items-center gap-1.5">
                {["1", "2", "3", "…", "8"].map((n, i) => (
                  <button
                    key={i}
                    className={cn(
                      "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition",
                      i === 0 ? "bg-navy text-white" : "text-slate-500 hover:bg-mist"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-navy">
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Home;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
        active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-mist/60"
      )}
    >
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span
        className={cn(
          "grid h-5 w-5 place-items-center rounded-md border transition",
          active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-transparent"
        )}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}
