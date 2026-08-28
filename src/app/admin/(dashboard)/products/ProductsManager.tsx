"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, Loader2, Star, PackageOpen, AlertCircle } from "lucide-react";
import type { ProductRow } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default function ProductsManager() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [source, setSource] = useState<"db" | "static">("db");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(data.products);
      setSource(data.source);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setDeleting(slug);
    const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setDeleting(null);
    if (!res.ok) {
      alert(data.error || "Delete failed.");
      return;
    }
    setRows((r) => r.filter((x) => x.slug !== slug));
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(term) || r.slug.toLowerCase().includes(term)
    );
  }, [rows, q]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading…" : `${rows.length} product${rows.length === 1 ? "" : "s"} in your shop.`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-premium transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {source === "static" && !loading && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Read-only preview of the built-in catalogue. Connect Supabase (see the Overview page) to add,
            edit, and save products.
          </span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products…"
          className="h-11 w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading products…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
            <PackageOpen className="h-8 w-8" />
            <p className="text-sm">{q ? "No products match your search." : "No products yet."}</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Badge</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.slug} className="group hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
                        style={{ borderColor: `${p.accent}33` }}
                      >
                        {p.image ? (
                          <Image src={p.image} alt={p.name} width={44} height={44} className="h-11 w-11 object-contain" />
                        ) : (
                          <span className="h-5 w-5 rounded" style={{ background: p.accent }} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-semibold text-navy">
                          {p.name}
                          {p.best_seller && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        </p>
                        <p className="truncate text-xs text-slate-400">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">{formatPrice(Number(p.price))}</span>
                    {p.compare_at != null && (
                      <span className="ml-1 text-xs text-slate-400 line-through">
                        {formatPrice(Number(p.compare_at))}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {p.badge ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                        {p.badge}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={
                        p.active
                          ? "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600"
                          : "inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"
                      }
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${p.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                      {p.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {source === "db" && (
                        <>
                          <Link
                            href={`/admin/products/${p.slug}`}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                            aria-label={`Edit ${p.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => remove(p.slug, p.name)}
                            disabled={deleting === p.slug}
                            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            aria-label={`Delete ${p.name}`}
                          >
                            {deleting === p.slug ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
