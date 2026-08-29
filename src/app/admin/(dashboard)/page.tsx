import Link from "next/link";
import { Package, Star, Tag, ArrowRight, Database, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabase";
import { isAdminConfigured } from "@/lib/admin-auth";
import { products as staticProducts } from "@/lib/products";
import SeedHint from "./SeedButton";

export const dynamic = "force-dynamic";

async function loadStats() {
  const db = supabaseAdmin();
  if (!db) {
    return {
      total: staticProducts.length,
      bestSellers: staticProducts.filter((p) => p.bestSeller).length,
      onSale: staticProducts.filter((p) => p.compareAt).length,
      dbRows: 0,
      configured: false,
    };
  }
  const { data } = await db.from("products").select("slug,best_seller,compare_at");
  const rows = data ?? [];
  return {
    total: rows.length,
    bestSellers: rows.filter((r) => r.best_seller).length,
    onSale: rows.filter((r) => r.compare_at != null).length,
    dbRows: rows.length,
    configured: true,
  };
}

export default async function AdminOverview() {
  const stats = await loadStats();
  const needsSetup = !isSupabaseAdminConfigured || !isAdminConfigured || stats.dbRows === 0;

  const tiles = [
    { label: "Products", value: stats.total, icon: Package, tint: "bg-brand-50 text-brand-600" },
    { label: "Best sellers", value: stats.bestSellers, icon: Star, tint: "bg-amber-50 text-amber-600" },
    { label: "On sale", value: stats.onSale, icon: Tag, tint: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* branded header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-navy px-7 py-8 text-white sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-navy via-brand-900 to-brand-700" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-200 backdrop-blur">
            <Sparkles className="h-3 w-3" /> Store dashboard
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-slate-300">
            {stats.configured
              ? "Your shop is live on Supabase — every edit publishes to the storefront."
              : "Manage your shop from here. Connect Supabase to make edits go live."}
          </p>
          <Link
            href="/admin/products"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-navy transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            Manage products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-2xl font-extrabold leading-none text-navy">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {needsSetup && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            <h2 className="font-bold">Finish setup</h2>
          </div>
          <p className="mt-1 text-sm text-amber-800/80">
            Complete these steps to go live. See <code className="rounded bg-amber-100 px-1">ADMIN_SETUP.md</code> for details.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <SetupItem done={isAdminConfigured}>Set an <code>ADMIN_PASSWORD</code> for team login</SetupItem>
            <SetupItem done={isSupabaseAdminConfigured}>Connect Supabase (URL + keys) and run <code>supabase/schema.sql</code></SetupItem>
            <SetupItem done={stats.dbRows > 0}>
              Seed your catalogue{" "}
              {isSupabaseAdminConfigured && stats.dbRows === 0 && <SeedHint />}
            </SetupItem>
          </ul>
        </div>
      )}

      {/* data source */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-slate-700">
          <Database className="h-5 w-5 text-brand-600" />
          <h2 className="font-bold">Data source</h2>
          <span
            className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              stats.configured ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${stats.configured ? "bg-emerald-500" : "bg-brand-500"}`} />
            {stats.configured ? "Live" : "Preview"}
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {stats.configured
            ? "The storefront reads products from your Supabase database."
            : "You’re in preview mode — explore everything freely; changes aren’t saved to the live site. Connect Supabase to publish edits."}
        </p>
      </div>
    </div>
  );
}

function SetupItem({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      {done ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      ) : (
        <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-amber-400" />
      )}
      <span className={done ? "text-slate-500 line-through" : "text-amber-900"}>{children}</span>
    </li>
  );
}
