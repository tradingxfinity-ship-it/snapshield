"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * The hero centerpiece: three real Snap Shield graded-card renders that cycle
 * through a display podium every 7s. Whichever card is on the podium rotates
 * continuously from front to back in 3D (phase-locked to the 7s cycle, so it
 * completes one clean flip before handing off). The display also tilts to the
 * cursor.
 */

type Card = { color: string; front: string; back: string };

const cards: Card[] = [
  { color: "blue", front: "/card-blue-front.png", back: "/card-blue-back.png" },
  { color: "black", front: "/card-black-front.png", back: "/card-black-back.png" },
  { color: "white", front: "/card-white-front.png", back: "/card-white-back.png" },
];

const CYCLE = 7000; // ms between switches

// slot layout by role — 0 = centre (podium), 1 = right, 2 = left
const slots = [
  { x: 0, scale: 1.06, angle: 0, y: 24, zIndex: 30 },
  { x: 205, scale: 0.74, angle: -20, y: 34, zIndex: 20 },
  { x: -205, scale: 0.74, angle: 20, y: 34, zIndex: 10 },
];

export default function HeroSlab({ y, scale }: { y: MotionValue<number>; scale: MotionValue<number> }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 140, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring);

  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % cards.length), CYCLE);
    return () => clearInterval(t);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div style={{ y, scale }} className="relative z-10 flex justify-center">
      <div
        className="relative w-full max-w-[600px]"
        style={{ perspective: 1600 }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
      >
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/4 h-[440px] w-[460px] -translate-x-1/2 rounded-full bg-brand-400/25 blur-[110px]"
          animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.95, 1.06, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="origin-center scale-[0.62] sm:scale-75 md:scale-90 lg:scale-100">
          <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative mx-auto h-[460px] w-[560px]">
            {/* podium behind */}
            <div className="absolute bottom-6 left-1/2 z-0 w-[300px] -translate-x-1/2">
              <Podium />
            </div>

            {/* cycling cards */}
            {cards.map((c, i) => {
              const role = (i - active + cards.length) % cards.length;
              const s = slots[role];
              const featured = role === 0;
              return (
                <motion.div
                  key={c.color}
                  className="absolute bottom-[86px] left-1/2 -ml-[120px] w-[240px]"
                  style={{ zIndex: s.zIndex, transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, x: s.x, y: s.y, scale: s.scale, rotateY: s.angle }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    animate={{ y: featured ? [0, -12, 0] : [0, -7, 0] }}
                    transition={{ duration: featured ? 5 : 6.5, repeat: Infinity, ease: "easeInOut" }}
                    className={featured ? "drop-shadow-[0_45px_70px_rgba(37,99,235,0.4)]" : "drop-shadow-[0_25px_40px_rgba(37,99,235,0.22)]"}
                  >
                    {/* flipper — spins only while on the podium */}
                    <motion.div
                      className="relative w-full [transform-style:preserve-3d]"
                      style={{ aspectRatio: "1024 / 1536" }}
                      animate={{ rotateY: featured ? 360 : 0 }}
                      transition={
                        featured
                          ? { duration: CYCLE / 1000, repeat: Infinity, ease: "linear" }
                          : { duration: 0.6, ease: "easeOut" }
                      }
                    >
                      <div className="absolute inset-0 [backface-visibility:hidden]">
                        <Image src={c.front} alt={`Snap Shield ${c.color} graded guard front`} fill sizes="300px" className="object-contain" priority={i === 0} />
                      </div>
                      <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
                        <Image src={c.back} alt={`Snap Shield ${c.color} graded guard back`} fill sizes="300px" className="object-contain" />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- display podium ---------- */

function Podium() {
  const TOP = 44;
  const WALL = 28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="relative" style={{ height: TOP + WALL }}>
        <div className="absolute inset-x-0 bottom-0 rounded-[50%] bg-gradient-to-b from-slate-300 to-slate-400" style={{ height: TOP }} />
        <div className="absolute inset-x-0 bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300" style={{ top: TOP / 2, height: WALL }} />
        <div
          className="absolute inset-x-0"
          style={{
            top: TOP / 2,
            height: WALL,
            background: "linear-gradient(90deg, rgba(15,23,42,0.10), transparent 22%, transparent 78%, rgba(15,23,42,0.10))",
          }}
        />
        <div className="absolute inset-x-0 top-0 rounded-[50%] bg-gradient-to-b from-white to-slate-100 shadow-[0_16px_30px_-10px_rgba(15,23,42,0.3)]" style={{ height: TOP }} />
        <div className="absolute left-1/2 top-3 h-5 w-[46%] -translate-x-1/2 rounded-[50%] bg-navy/25 blur-md" />
        <motion.div
          className="absolute inset-x-0 top-0 rounded-[50%] border-2 border-brand-500/70"
          style={{ height: TOP, boxShadow: "0 0 26px 2px rgba(37,99,235,0.55)" }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="absolute -bottom-6 left-1/2 h-9 w-[80%] -translate-x-1/2 rounded-[50%] bg-brand-400/25 blur-2xl" />
    </motion.div>
  );
}
