"use client";

import Image from "next/image";
import { ArrowRight, Palette, Sparkles, ShieldCheck } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { ButtonLink } from "../ui/Button";

const highlights = [
  { icon: Sparkles, label: "Matte & gloss finishes" },
  { icon: ShieldCheck, label: "UV-stable, no fade" },
];

export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      {/* layered background */}
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* text */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 shadow-soft">
            <Palette className="h-3.5 w-3.5" /> Endless finishes
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
            Available in <span className="gradient-text">40+ colors</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            From electric blue to wildfire, cosmic to emerald — every Snap Shield guard comes in a
            finish to match any grail. Colour-code your collection or make a statement on the shelf.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-navy backdrop-blur"
              >
                <Icon className="h-4 w-4 text-brand-600" /> {label}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <ButtonLink href="/shop" size="lg">
              Shop all finishes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </Reveal>

        {/* image — transparent PNG floating on the section */}
        <Reveal delay={0.1}>
          <div className="relative lg:w-[104%] lg:max-w-none xl:w-[108%]">
            {/* ambient colour glow behind the slabs */}
            <div className="pointer-events-none absolute inset-0 -z-10 mx-auto my-auto h-[80%] w-[85%] rounded-full bg-[conic-gradient(from_180deg,#a855f7,#ef4444,#22d3ee,#22c55e,#f97316,#3b82f6,#a855f7)] opacity-25 blur-3xl" />
            <div className="animate-float">
              <Image
                src="/colors-showcase.png"
                alt="Snap Shield PSA slab guards in many colours"
                width={1536}
                height={1024}
                priority
                className="h-auto w-full drop-shadow-[0_40px_70px_rgba(15,23,42,0.22)]"
              />
            </div>
            <span className="absolute left-2 top-2 rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-white shadow-soft">
              40+ finishes
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
