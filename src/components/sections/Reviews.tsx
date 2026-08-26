"use client";

import { motion } from "framer-motion";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const reviews = [
  {
    name: "Jordan D.",
    role: "Pokémon Collector",
    initials: "JD",
    accent: "#2563EB",
    text: "My Charizard finally has protection worthy of the grade. The fit is unreal — it snaps on and looks like it belongs in a museum.",
  },
  {
    name: "Marcus K.",
    role: "Sports Card Investor",
    initials: "MK",
    accent: "#0f172a",
    text: "I move six-figure slabs to shows constantly. Snap Shield is the only guard I trust. The clarity is genuinely better than anything else.",
  },
  {
    name: "Aria R.",
    role: "TCG Grader",
    initials: "AR",
    accent: "#3B82F6",
    text: "The build quality feels Apple-tier. Zero haze, perfect tolerances, premium in the hand. Worth every dollar.",
  },
  {
    name: "Tyler S.",
    role: "Premium Collector",
    initials: "TS",
    accent: "#1d4ed8",
    text: "Bought the Collector Pack and re-cased my entire top shelf. My display has never looked cleaner. Instant upgrade.",
  },
  {
    name: "Nina P.",
    role: "Vintage Collector",
    initials: "NP",
    accent: "#60a5fa",
    text: "Finally a guard made ONLY for PSA. No compromises for other grades — it fits perfectly because it was built for this.",
  },
  {
    name: "Chris L.",
    role: "Investor",
    initials: "CL",
    accent: "#334155",
    text: "Shipping was fast, packaging was premium, and the product over-delivered. This is how you build a brand.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
      {/* blue gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy via-brand-900 to-brand-700" />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="container-x relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-300">Reviews</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Loved by serious collectors
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-soft">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-navy">4.9</span>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">4,000+ verified reviews</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col rounded-3xl border border-slate-100 bg-white p-7 shadow-soft transition-shadow hover:shadow-premium"
            >
              <Quote className="h-8 w-8 text-brand-100" fill="currentColor" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">“{r.text}”</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: r.accent }}>
                  {r.initials}
                </span>
                <div>
                  <p className="flex items-center gap-1 text-sm font-bold text-navy">
                    {r.name} <BadgeCheck className="h-4 w-4 text-brand-600" />
                  </p>
                  <p className="text-xs text-slate-500">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
