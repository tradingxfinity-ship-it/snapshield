"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles, Mail } from "lucide-react";
import { useState } from "react";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Does Snap Shield fit all PSA slabs?",
    a: "Yes. Every Snap Shield guard is engineered exclusively around standard PSA slab dimensions with a 0.1mm tolerance for a precise, secure fit. We build for PSA and PSA only — no compromises for other grading companies.",
  },
  {
    q: "Do you make guards for BGS or CGC slabs?",
    a: "No. Snap Shield is dedicated 100% to PSA graded cards. Because we don't split our engineering across multiple slab shapes, our PSA fit and clarity are unmatched.",
  },
  {
    q: "Will the guard scratch or yellow over time?",
    a: "Our optical-grade polymer is scratch-resistant and includes 99% UV-A/UV-B protection, so your guard — and the card inside — stay crystal clear and won't yellow under display lighting.",
  },
  {
    q: "Can I still see the PSA label and grade clearly?",
    a: "Absolutely. Snap Shield adds zero haze. Your grade, cert number, holo, and card art remain fully visible and vibrant.",
  },
  {
    q: "How does shipping work?",
    a: "Orders ship within 1–2 business days. Free shipping on orders over $50. All orders include tracking, and grails travel in protective, premium packaging.",
  },
  {
    q: "What's your return policy?",
    a: "We offer a 30-day satisfaction guarantee. If your guard isn't flawless, we'll replace it or refund you — no drama.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
      {/* atmospheric background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-brand-900/80 to-navy" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.15]" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-400/20 blur-[110px]" />

      <div className="container-x relative grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* left — heading + contact card */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" /> Snap Shield Support
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>

          <div className="group relative mt-8 max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
            <h3 className="relative text-xl font-bold text-white">Still have questions?</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-slate-300">
              Can&apos;t find the answer you&apos;re looking for? Send us an email and our collector
              support team will get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@snapshield.com"
              className="relative mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-navy shadow-premium transition hover:shadow-glow hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" /> Send email
            </a>
          </div>
        </Reveal>

        {/* right — accordion cards */}
        <Reveal delay={0.1}>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  className={cn(
                    "overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
                    isOpen
                      ? "border-brand-400/60 bg-white/[0.09] shadow-glow"
                      : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.06]"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors",
                        isOpen ? "bg-brand-gradient text-white" : "bg-white/10 text-slate-300"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] font-bold text-white sm:text-base">{f.q}</span>
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                        isOpen ? "bg-brand-600 text-white" : "bg-white/10 text-slate-300"
                      )}
                    >
                      <ChevronDown className={cn("h-[18px] w-[18px] transition-transform duration-300", isOpen && "rotate-180")} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pl-[4.25rem] pr-6 text-[15px] leading-relaxed text-slate-300">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
