"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "../ui/Button";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative bg-white">
      <div className="relative overflow-hidden">
        {/* desktop background image — full-bleed behind the nav (overlaid layout) */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <Image src="/hero-bg.png" alt="Snap Shield graded card guards" fill priority className="object-cover object-top" />
        </div>
        <div className="container-x relative">
          <motion.div style={{ opacity }} className="max-w-xl pb-8 pt-[116px] sm:pb-12 lg:pb-40 lg:pt-52">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl font-bold leading-[0.98] tracking-tight text-navy sm:text-6xl lg:text-7xl"
            >
              Protect
              <br />
              What <span className="gradient-text">Matters.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-md text-lg leading-relaxed text-slate-600"
            >
              Premium protective guards engineered exclusively for PSA graded trading cards.
              Crystal-clear, scratch-resistant, and machined to a perfect fit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href="/shop" size="lg">
                Shop Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/#why" variant="secondary" size="lg">
                Learn More
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>

        {/* mobile / tablet image banner — shown below the copy so text never overlaps it */}
        <div className="relative h-[440px] w-full overflow-hidden sm:h-[540px] lg:hidden">
          <Image src="/hero-bg.png" alt="Snap Shield graded card guards" fill className="object-cover object-[right_center]" />
        </div>
      </div>

      {/* marquee */}
      <div className="relative border-y border-slate-200/70 bg-white/50 py-5 backdrop-blur">
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="flex shrink-0 items-center gap-12 pr-12 text-sm font-bold uppercase tracking-widest text-slate-400"
          >
            {Array.from({ length: 2 }).flatMap((_, r) =>
              ["Pokémon Collectors", "•", "Sports Cards", "•", "TCG Grails", "•", "Investors", "•", "Premium Collectors", "•"].map(
                (t, i) => <span key={`${r}-${i}`}>{t}</span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
