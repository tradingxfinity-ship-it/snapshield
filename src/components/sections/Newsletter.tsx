"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState } from "react";
import { Reveal } from "../ui/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-6 py-16 text-center shadow-premium sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-90" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-navy/40 blur-3xl" />

            {/* decorative floating cards */}
            <motion.div
              aria-hidden
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -bottom-24 -left-16 hidden w-[210px] rotate-[-18deg] drop-shadow-2xl sm:block lg:w-[300px]"
            >
              <Image src="/card-black-front.png" alt="" width={300} height={450} className="h-auto w-full" />
            </motion.div>
            <motion.div
              aria-hidden
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="pointer-events-none absolute -bottom-24 -right-16 hidden w-[210px] rotate-[18deg] drop-shadow-2xl sm:block lg:w-[300px]"
            >
              <Image src="/card-white-front.png" alt="" width={300} height={450} className="h-auto w-full" />
            </motion.div>

            <div className="relative mx-auto max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                <Mail className="h-4 w-4" /> Join the collectors list
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Get 10% off your first guard
              </h2>
              <p className="mt-4 text-lg text-blue-50">
                Early drops, restock alerts, and collector-only offers — straight to your inbox.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setDone(true);
                }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@collection.com"
                  className="h-14 flex-1 rounded-full border border-white/30 bg-white/15 px-6 text-white outline-none backdrop-blur placeholder:text-blue-100 focus:border-white focus:bg-white/25"
                />
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 font-bold text-brand-700 shadow-soft transition hover:bg-blue-50"
                >
                  {done ? (
                    <>
                      <Check className="h-5 w-5" /> Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>
              <p className="mt-4 text-xs text-blue-100">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
