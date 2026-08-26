"use client";

import Image from "next/image";
import { ArrowRight, Palette } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { ButtonLink } from "../ui/Button";

export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* text */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
            <Palette className="h-3.5 w-3.5" /> Endless finishes
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Available in <span className="gradient-text">40+ colors</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            From electric blue to wildfire, cosmic to emerald — every Snap Shield guard comes in a
            finish to match any grail. Colour-code your collection or make a statement on the shelf.
          </p>

          <div className="mt-9">
            <ButtonLink href="/shop" size="lg">
              Shop all finishes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </Reveal>

        {/* image — transparent PNG floating on the section */}
        <Reveal delay={0.1}>
          <div className="relative">
            <Image
              src="/colors-showcase.png"
              alt="Snap Shield PSA slab guards in many colours"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full drop-shadow-[0_30px_60px_rgba(15,23,42,0.18)]"
            />
            <span className="absolute left-2 top-2 rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white shadow-soft">
              40+ finishes
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
