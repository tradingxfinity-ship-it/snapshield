"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Star, PackageOpen, EyeOff } from "lucide-react";
import type { ProductRow } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { adminToast } from "../toast";

export default function ProductsManager() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [rows, setRows] = useState<ProductRow[]>([]);
  const [source, setSource] = useState<"db" | "static">("db");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const preview = source === "static";

  async function remove(slug: string, name: string) {
    if (preview) {
      if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
      setRows((r) => r.filter((x) => x.slug !== slug));
      adminToast("Product deleted");
      return;
    }
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading…"
              : q
                ? `${filtered.length} of ${rows.length} match “${q}”.`
                : `${rows.length} product${rows.length === 1 ? "" : "s"} in your shop.`}
          </p>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading products…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* add card */}
          {!q && (
            <Link
              href="/admin/products/new"
              className="group flex min-h-[15rem] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-slate-400 transition hover:border-brand-300 hover:text-brand-600"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-50 transition group-hover:bg-brand-50">
                <Plus className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold">New product</span>
            </Link>
          )}

          {filtered.map((p) => (
            <ProductTile
              key={p.slug}
              p={p}
              editable
              deleting={deleting === p.slug}
              onDelete={() => remove(p.slug, p.name)}
            />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-16 text-slate-400">
              <PackageOpen className="h-8 w-8" />
              <p className="text-sm">{q ? "No products match your search." : "No products yet."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductTile({
  p,
  editable,
  deleting,
  onDelete,
}: {
  p: ProductRow;
  editable: boolean;
  deleting: boolean;
  onDelete: () => void;
}) {
  const inner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white">
        {/* badges */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {p.badge && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy shadow-sm ring-1 ring-slate-200 backdrop-blur">
              {p.badge}
            </span>
          )}
          {!p.active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <EyeOff className="h-3 w-3" /> Hidden
            </span>
          )}
        </div>
        {p.best_seller && (
          <span className="absolute right-2.5 top-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-white shadow-glow">
            <Star className="h-3.5 w-3.5 fill-white" />
          </span>
        )}
        {p.image ? (
          <Image src={p.image} alt={p.name} fill sizes="(max-width:640px) 50vw, 240px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="h-16 w-16 rounded-2xl" style={{ background: p.accent }} />
          </div>
        )}
      </div>
      <div className="px-1 pt-3">
        <p className="truncate text-sm font-bold text-navy">{p.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-navy">{formatPrice(Number(p.price))}</span>
          {p.compare_at != null && (
            <span className="text-xs text-slate-400 line-through">{formatPrice(Number(p.compare_at))}</span>
          )}
        </div>
      </div>
    </>
  );

  if (!editable) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-2.5">{inner}</div>;
  }

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-2.5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-premium">
      <Link href={`/admin/products/${p.slug}`} className="block">
        {inner}
      </Link>
      {/* hover actions */}
      <div className="absolute inset-x-2.5 bottom-14 flex justify-end gap-1.5 opacity-0 transition group-hover:opacity-100">
        <Link
          href={`/admin/products/${p.slug}`}
          className="grid h-8 w-8 place-items-center rounded-lg bg-white text-navy shadow-md ring-1 ring-slate-200 transition hover:bg-brand-600 hover:text-white"
          aria-label={`Edit ${p.name}`}
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="grid h-8 w-8 place-items-center rounded-lg bg-white text-navy shadow-md ring-1 ring-slate-200 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
          aria-label={`Delete ${p.name}`}
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
