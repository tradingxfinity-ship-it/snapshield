"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Eye, Ruler, Shield, Award, Phone, Sparkles } from "lucide-react";
import { Reveal, staggerContainer, staggerItem } from "../ui/Reveal";
import { ButtonLink } from "../ui/Button";

const features = [
  { icon: Eye, title: "Crystal Clear Protection", label: "Optical-grade clarity with zero haze" },
  { icon: Ruler, title: "Perfect PSA Fit", label: "Machined to a 0.1mm tolerance" },
  { icon: Shield, title: "Scratch Resistant", label: "Hardened shell shrugs off wear" },
  { icon: Award, title: "Collector Approved", label: "Trusted by serious collectors" },
];

export default function WhySnapShield() {
  return (
    <section id="why" className="relative bg-white py-24 lg:py-32">
      <div className="container-x">
        {/* centered header */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-navy">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" /> Why Snap Shield
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Built For Collectors. Obsessed With Protection.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
            We engineer premium protective guards exclusively for PSA graded cards — crafted to
            preserve, protect, and showcase what matters most.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* left — exploded view */}
          <Reveal>
            <div className="relative mx-auto w-full max-w-lg lg:mx-0">
              <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-[#0a0f1e] shadow-premium">
                <Image
                  src="/why-snapshield.jpg"
                  alt="A PSA-graded Charizard in a Snap Shield case, surrounded by Snap Shield guards"
                  width={1254}
                  height={1254}
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>

          {/* right — stats + CTA */}
          <div className="flex flex-col">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:border-brand-200 hover:bg-white hover:shadow-soft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                    <f.icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <p className="mt-5 text-lg font-bold tracking-tight text-navy">{f.title}</p>
                  <p className="mt-1.5 text-sm leading-snug text-slate-500">{f.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <ButtonLink href="/shop" variant="dark" size="md">
                  Shop Guards
                </ButtonLink>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-navy">
                    <Phone className="h-[18px] w-[18px]" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs text-slate-500">Collector support</p>
                    <p className="text-sm font-bold text-navy">+1 (800) 762-7433</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
