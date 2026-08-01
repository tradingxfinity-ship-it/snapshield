"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { getProduct } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import SlabVisual from "../ui/SlabVisual";

const slabs = [
  { accent: "#dc2626", guard: "#f87171", id: "bundle-ruby", label: "RUBY" },
  { accent: "#d97706", guard: "#fbbf24", id: "bundle-gold", label: "GOLD" },
  { accent: "#16a34a", guard: "#4ade80", id: "bundle-emerald", label: "EMERALD" },
  { accent: "#2563EB", guard: "#60a5fa", id: "bundle-sapphire", label: "SAPPHIRE" },
  { accent: "#7c3aed", guard: "#a78bfa", id: "bundle-amethyst", label: "AMETHYST" },
];

function Slab({ accent, guard, id, index }: { accent: string; guard: string; id: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: index % 2 ? 2 : -2 }}
      className="drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)]"
    >
      <SlabVisual accent={accent} guard={guard} id={id} label="GEM MT" />
    </motion.div>
  );
}

export default function BundleShowcase() {
  const bundle = getProduct("snap-shield-5-color-bundle")!;
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const add = () => {
    addItem(
      { slug: bundle.slug, name: bundle.name, price: bundle.price, color: "5-Color Set", accent: bundle.accent },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section id="bundle" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* left — five colored guards */}
        <Reveal>
          <div className="mx-auto max-w-xl">
            <div className="grid grid-cols-3 gap-4">
              {slabs.slice(0, 3).map((s, i) => (
                <Slab key={s.id} {...s} index={i} />
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {slabs.slice(3).map((s, i) => (
                <div key={s.id} className="w-1/3">
                  <Slab {...s} index={i + 3} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* right — bundle details */}
        <Reveal delay={0.1}>
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
              Limited Bundle
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Grab a bundle and save 10% now!
            </h2>
            <p className="mt-4 text-2xl font-semibold text-slate-500">
              {bundle.name} <span className="text-slate-400">(PSA)</span>
            </p>

            {/* price */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {bundle.compareAt && (
                <span className="text-2xl text-slate-400 line-through">{formatPrice(bundle.compareAt)}</span>
              )}
              <span className="text-3xl font-extrabold text-brand-600">{formatPrice(bundle.price)}</span>
              <span className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-bold text-white">Save 10%</span>
            </div>

            <p className="mx-auto mt-4 max-w-md text-slate-500 lg:mx-0">{bundle.description}</p>

            {/* quantity + add to cart */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <div className="inline-flex items-center rounded-2xl border border-slate-200 p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition hover:bg-mist hover:text-navy"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-lg font-bold text-navy">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition hover:bg-mist hover:text-navy"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button onClick={add} variant="dark" size="lg" className="min-w-[190px]">
                {added ? (
                  <>
                    <Check className="h-5 w-5" /> Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>

            {/* finish legend */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {slabs.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <span className="h-3 w-3 rounded-full ring-1 ring-black/5" style={{ background: s.accent }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
