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
    <section id="faq" className="relative bg-mist py-24 lg:py-32">
      <div className="container-x grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* left — heading + contact card */}
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" /> Snap Shield Support
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-navy sm:text-5xl">
            Frequently asked questions
          </h2>

          <div className="mt-8 max-w-md rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 shadow-soft">
            <h3 className="text-xl font-bold text-navy">Still have questions?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Can&apos;t find the answer you&apos;re looking for? Send us an email and our collector
              support team will get back to you as soon as possible.
            </p>
            <a
              href="mailto:support@snapshield.com"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-7 text-sm font-semibold text-white shadow-premium transition hover:bg-brand-700 hover:shadow-glow"
            >
              <Mail className="h-4 w-4" /> Send email
            </a>
          </div>
        </Reveal>

        {/* right — accordion cards */}
        <Reveal delay={0.1}>
          <div className="space-y-4">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  className={cn(
                    "rounded-2xl border bg-white transition-all duration-300",
                    isOpen ? "border-brand-200 shadow-premium" : "border-slate-100 shadow-soft hover:border-slate-200"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] font-bold text-navy sm:text-base">{f.q}</span>
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                        isOpen ? "bg-brand-600 text-white" : "bg-mist text-slate-500"
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
                        <p className="px-6 pb-6 text-[15px] leading-relaxed text-slate-500">{f.a}</p>
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
