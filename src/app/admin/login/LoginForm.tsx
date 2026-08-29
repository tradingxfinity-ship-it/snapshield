"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-navy shadow-premium">
          <Image src="/logo-mark.png" alt="Snap Shield" width={40} height={40} className="h-9 w-9 object-contain" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy">Snap Shield Admin</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-brand-600" /> Team dashboard
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]"
      >
        <label htmlFor="password" className="text-sm font-semibold text-navy">
          Password
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-brand-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-100">
          <Lock className="h-4 w-4 text-slate-400" />
          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter team password"
            className="h-12 w-full bg-transparent text-navy placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-bold text-white shadow-premium transition hover:bg-brand-700 hover:shadow-glow disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">Authorized Snap Shield staff only.</p>
    </div>
  );
}
