"use client";

import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const posts = [
  { user: "@grailhunter", grade: "10", accent: "#2563EB", card: "Charizard 1st Ed", likes: "2.4k", span: "row-span-2" },
  { user: "@slabvault", grade: "9", accent: "#0f172a", card: "Jordan Rookie", likes: "1.1k", span: "" },
  { user: "@pokeinvest", grade: "10", accent: "#3B82F6", card: "Umbreon VMAX", likes: "3.8k", span: "" },
  { user: "@tcg.dan", grade: "10", accent: "#1d4ed8", card: "Black Lotus", likes: "5.2k", span: "row-span-2" },
  { user: "@cardcollector", grade: "9", accent: "#60a5fa", card: "Brady Auto", likes: "890", span: "" },
  { user: "@mintcondition", grade: "10", accent: "#334155", card: "Pikachu Illustrator", likes: "9.1k", span: "" },
];

export default function CollectorGallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-600">
              <Instagram className="h-4 w-4" /> Collector Gallery
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Grails in the wild
            </h2>
            <p className="mt-5 text-lg text-slate-600">
              Tag <span className="font-bold text-navy">#SnapShield</span> to be featured. Real collectors, real cards, flawlessly protected.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid auto-rows-[180px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((p, i) => (
            <motion.div
              key={p.user}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className={`group relative overflow-hidden rounded-3xl shadow-soft ${p.span}`}
              style={{ background: `linear-gradient(150deg, ${p.accent}, #0f172a)` }}
            >
              {/* faux card */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-[62%] w-[46%] rounded-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
                  <div className="m-1.5 h-4 rounded bg-white/25" />
                  <div className="mx-auto mt-3 h-10 w-10 rounded-full bg-white/30" />
                </div>
              </div>
              <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                PSA {p.grade}
              </span>
              {/* hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-sm font-bold text-white">{p.card}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-blue-100">
                  <span>{p.user}</span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-white text-white" /> {p.likes}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
