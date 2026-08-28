import Link from "next/link";
import { Package, Star, Tag, Plus, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { isSupabaseAdminConfigured, supabaseAdmin } from "@/lib/supabase";
import { isAdminConfigured } from "@/lib/admin-auth";
import { products as staticProducts } from "@/lib/products";
import SeedHint from "./SeedButton";

export const dynamic = "force-dynamic";

async function loadStats() {
  const db = supabaseAdmin();
  if (!db) {
    return { total: staticProducts.length, bestSellers: staticProducts.filter((p) => p.bestSeller).length, onSale: staticProducts.filter((p) => p.compareAt).length, dbRows: 0, configured: false };
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

  const cards = [
    { label: "Products", value: stats.total, icon: Package, tint: "text-brand-600 bg-brand-50" },
    { label: "Best sellers", value: stats.bestSellers, icon: Star, tint: "text-amber-600 bg-amber-50" },
    { label: "On sale", value: stats.onSale, icon: Tag, tint: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your shop and product catalogue.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-premium transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {needsSetup && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
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
              {isSupabaseAdminConfigured && stats.dbRows === 0 && (
                <SeedHint />
              )}
            </SetupItem>
          </ul>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Database className="h-5 w-5 text-brand-600" />
          <h2 className="font-bold">Data source</h2>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {stats.configured
            ? "Live — the storefront reads products from your Supabase database."
            : "Static fallback — connect Supabase to make edits persist. The site currently shows the built-in catalogue."}
        </p>
        <Link href="/admin/products" className="mt-4 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">
          Manage products →
        </Link>
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
