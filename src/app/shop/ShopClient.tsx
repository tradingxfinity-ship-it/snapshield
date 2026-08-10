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
} from "lucide-react";
import { products, categories, shopImages } from "@/lib/products";
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
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
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
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              i === slide ? "opacity-100" : "opacity-0"
            )}
          >
            <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover object-center" />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-navy/10" />

        {/* slide dots */}
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-28">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === slide ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
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
              return (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  className="group flex flex-col rounded-2xl border border-slate-100 p-3 transition-shadow hover:shadow-soft"
                >
                  <div className="relative">
                    <span className="absolute right-2 top-2 z-10 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-navy backdrop-blur">
                      {p.category}
                    </span>
                    <button
                      onClick={() => toggleWishlist(p.slug)}
                      aria-label="Wishlist"
                      className="absolute left-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-400 backdrop-blur transition hover:text-brand-600"
                    >
                      <Star className={cn("h-4 w-4", wished && "fill-amber-400 text-amber-400")} />
                    </button>
                    <Link href={`/product/${p.slug}`} className="block aspect-[4/5] overflow-hidden rounded-xl bg-mist">
                      {photo ? (
                        <Image
                          src={photo.src}
                          alt={p.name}
                          fill
                          sizes="(max-width:640px) 100vw, 300px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center p-6">
                          <SlabVisual accent={p.accent} guard={p.colors[0].hex} id={`shop-${p.slug}`} />
                        </div>
                      )}
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-1 flex-col px-1">
                    <Link href={`/product/${p.slug}`} className="text-base font-bold tracking-tight text-navy hover:text-brand-600">
                      {p.name}
                    </Link>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {p.rating} ({p.reviewCount.toLocaleString()} Reviews)
                      </span>
                      <span className="text-lg font-extrabold text-navy">{formatPrice(p.price)}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          addItem({ slug: p.slug, name: p.name, price: p.price, color: p.colors[0].name, accent: p.accent })
                        }
                        className="rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-navy transition hover:border-navy"
                      >
                        Add to Cart
                      </button>
                      <Link
                        href={`/product/${p.slug}`}
                        className="rounded-full bg-navy py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
                      >
                        Buy Now
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
