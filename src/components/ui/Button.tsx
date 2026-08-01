"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, type ReactNode, type MouseEvent } from "react";

type Ripple = { x: number; y: number; id: number };

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const variants = {
  primary:
    "bg-brand-600 text-white shadow-premium hover:bg-brand-700 hover:shadow-glow",
  secondary:
    "bg-white text-navy border border-slate-200 hover:border-brand-300 hover:text-brand-600 shadow-soft",
  ghost: "bg-transparent text-navy hover:bg-slate-100",
  dark: "bg-navy text-white hover:bg-slate-800 shadow-soft",
};

const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[15px]",
  lg: "h-14 px-9 text-base",
};

function useRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const add = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
  };
  const layer = (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-[ripple_0.6s_ease-out] rounded-full bg-white/40"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </span>
  );
  return { add, layer };
}

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
}: BaseProps & {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
}) {
  const { add, layer } = useRipples();
  return (
    <button
      type={type}
      onClick={(e) => {
        add(e);
        onClick?.(e);
      }}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {layer}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
}: BaseProps & { href: string }) {
  const { add, layer } = useRipples();
  return (
    <Link href={href} onClick={add} className={cn(base, variants[variant], sizes[size], className)}>
      {layer}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
