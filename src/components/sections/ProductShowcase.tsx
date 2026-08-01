"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import { getProduct } from "@/lib/products";
import { Reveal } from "../ui/Reveal";
import { ButtonLink } from "../ui/Button";
import { cn } from "@/lib/utils";

const finishes = [
  { name: "Electric Blue", swatch: "#2563EB", front: "/card-blue-front.png", back: "/card-blue-back.png" },
  { name: "Midnight Black", swatch: "#0f172a", front: "/card-black-front.png", back: "/card-black-back.png" },
  { name: "Snow White", swatch: "#e5e7eb", front: "/card-white-front.png", back: "/card-white-back.png" },
];

export default function ProductShowcase() {
  const product = getProduct("snap-shield-pro")!;
  const [finish, setFinish] = useState(finishes[0]);

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        {/* spinning stage */}
        <Reveal>
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-100 bg-gradient-to-br from-mist to-white shadow-soft"
            style={{ perspective: 1400 }}
          >
            <div
              className="absolute inset-0 opacity-70 transition-colors duration-700"
              style={{ background: `radial-gradient(60% 60% at 50% 40%, ${finish.swatch}22, transparent 70%)` }}
            />
            <div className="animate-spin-slow pointer-events-none absolute h-[70%] w-[70%] rounded-full border border-dashed border-brand-200/60" />

            {/* continuously spinning card */}
            <div
              className="relative w-[52%] drop-shadow-[0_35px_60px_rgba(37,99,235,0.28)]"
              style={{ aspectRatio: "1024 / 1536" }}
            >
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{ rotateY: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <Image src={finish.front} alt={`Snap Shield ${finish.name} front`} fill sizes="360px" className="object-contain" />
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
                  <Image src={finish.back} alt={`Snap Shield ${finish.name} back`} fill sizes="360px" className="object-contain" />
                </div>
              </motion.div>
            </div>

            <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
              <RefreshCw className="h-3.5 w-3.5 text-brand-600" /> 360° continuous view
            </span>
          </div>
        </Reveal>

        {/* controls */}
        <Reveal delay={0.1}>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Product Showcase</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Your card, your finish.
          </h2>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            The {product.name} comes in finishes engineered to complement any collection — from clean
            electric blue to midnight black and snow white. Spin it, style it, make it yours.
          </p>

          <div className="mt-8">
            <p className="text-sm font-semibold text-navy">
              Finish — <span className="text-slate-500">{finish.name}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {finishes.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFinish(f)}
                  aria-label={f.name}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full ring-2 ring-offset-2 transition",
                    finish.name === f.name ? "ring-brand-600" : "ring-transparent hover:ring-slate-200"
                  )}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/5" style={{ background: f.swatch }}>
                    {finish.name === f.name && (
                      <Check className={cn("h-4 w-4", f.swatch === "#e5e7eb" ? "text-navy" : "text-white")} />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <ButtonLink href={`/product/${product.slug}`} size="lg">
              Shop {product.name}
            </ButtonLink>
            <span className="text-2xl font-extrabold text-navy">${product.price}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
