"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ExternalLink, LogOut, Loader2, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [term, setTerm] = useState("");
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const first = useRef(true);

  useEffect(() => {
    function onToast(e: Event) {
      const msg = (e as CustomEvent<string>).detail;
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, msg }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
    }
    window.addEventListener("admin-toast", onToast);
    return () => window.removeEventListener("admin-toast", onToast);
  }, []);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Global search → drives the products gallery via the URL query.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      const qs = term.trim() ? `?q=${encodeURIComponent(term.trim())}` : "";
      router.push(`/admin/products${qs}`);
    }, 250);
    return () => clearTimeout(id);
  }, [term, router]);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* brand */}
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo-mark.png" alt="Snap Shield" width={30} height={30} className="h-7 w-7 object-contain" />
            <span className="hidden font-display text-sm font-bold tracking-wide text-navy sm:block">
              SNAP SHIELD
            </span>
            <span className="hidden rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-700 sm:block">
              Admin
            </span>
          </Link>

          {/* nav pills */}
          <nav className="ml-1 flex items-center gap-1 sm:ml-3">
            {nav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition",
                  isActive(href) ? "bg-navy text-white" : "text-slate-500 hover:bg-slate-100 hover:text-navy"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* search */}
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 md:flex md:w-56 lg:w-72">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search products…"
              className="h-9 w-full bg-transparent text-sm focus:outline-none"
            />
          </div>

          {/* actions */}
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link
              href="/admin/products/new"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 text-sm font-semibold text-white shadow-premium transition hover:bg-brand-700"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New product</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-navy"
              aria-label="View live site"
            >
              <ExternalLink className="h-[18px] w-[18px]" />
            </Link>
            <button
              onClick={logout}
              disabled={loggingOut}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Sign out"
            >
              {loggingOut ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <LogOut className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {/* mobile search */}
        <div className="mx-auto flex max-w-6xl items-center gap-2 border-t border-slate-100 px-4 py-2 md:hidden">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products…"
            className="h-8 w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>

      {/* toast host */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-premium"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
