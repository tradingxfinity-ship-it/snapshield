"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Upload,
  Plus,
  Trash2,
  Save,
  ImageIcon,
} from "lucide-react";
import type { ProductRow } from "@/lib/products";
import { adminToast } from "../toast";

type Spec = { label: string; value: string };

type FormState = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  compareAt: string;
  rating: string;
  reviewCount: string;
  badge: string;
  category: string;
  accent: string;
  packSize: string;
  image: string;
  bestSeller: boolean;
  active: boolean;
  features: string[];
  specs: Spec[];
};

function fromRow(row?: ProductRow): FormState {
  return {
    name: row?.name ?? "",
    slug: row?.slug ?? "",
    tagline: row?.tagline ?? "",
    description: row?.description ?? "",
    price: row?.price != null ? String(row.price) : "",
    compareAt: row?.compare_at != null ? String(row.compare_at) : "",
    rating: row?.rating != null ? String(row.rating) : "4.8",
    reviewCount: row?.review_count != null ? String(row.review_count) : "0",
    badge: row?.badge ?? "",
    category: row?.category ?? "Slab Guards",
    accent: row?.accent ?? "#2563EB",
    packSize: row?.pack_size ?? "Single guard",
    image: row?.image ?? "",
    bestSeller: row?.best_seller ?? false,
    active: row?.active ?? true,
    features: row?.features?.length ? row.features : ["Crystal Clear", "Perfect PSA Fit"],
    specs: row?.specs?.length ? row.specs : [{ label: "Compatibility", value: "PSA Standard Slabs" }],
  };
}

export default function ProductForm({
  mode,
  initial,
  preview = false,
}: {
  mode: "new" | "edit";
  initial?: ProductRow;
  preview?: boolean;
}) {
  const router = useRouter();
  const [f, setF] = useState<FormState>(() => fromRow(initial));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) {
      set("image", URL.createObjectURL(file));
      adminToast("Image added — preview only");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("image", data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!f.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (preview) {
      setSaving(true);
      adminToast(mode === "new" ? "Product created — preview only" : "Saved — preview only, not live");
      setTimeout(() => {
        router.push("/admin/products");
      }, 400);
      return;
    }
    setSaving(true);
    const payload = {
      ...f,
      price: f.price,
      compareAt: f.compareAt,
      rating: f.rating,
      reviewCount: f.reviewCount,
      features: f.features.filter((x) => x.trim() !== ""),
      specs: f.specs.filter((s) => s.label.trim() !== "" || s.value.trim() !== ""),
    };
    try {
      const res =
        mode === "new"
          ? await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/products/${initial!.slug}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl pb-24">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-navy">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {mode === "new" ? "New product" : `Edit ${initial?.name}`}
        </h1>
        {preview && (
          <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
            Preview — not saved
          </span>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Basics */}
      <Section title="Basics">
        <Field label="Name" required>
          <input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Amber" />
        </Field>
        {mode === "edit" && (
          <Field label="Slug" hint="Permanent — the product URL.">
            <input className={`${inputCls} bg-slate-50 text-slate-500`} value={f.slug} readOnly />
          </Field>
        )}
        <Field label="Tagline">
          <input className={inputCls} value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Warm amber edge with a premium glow" />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} min-h-[110px] py-3`} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </Section>

      {/* Image */}
      <Section title="Image">
        <div className="flex items-center gap-5">
          <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {f.image ? (
              <Image src={f.image} alt="" width={96} height={96} className="h-24 w-24 object-contain" />
            ) : (
              <ImageIcon className="h-7 w-7 text-slate-300" />
            )}
          </span>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-navy transition hover:border-brand-300 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
            <input
              className={`${inputCls} mt-2`}
              value={f.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="…or paste an image URL / path (e.g. /slabs/amber.png)"
            />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing & rating">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Price ($)" required>
            <input className={inputCls} type="number" step="0.01" value={f.price} onChange={(e) => set("price", e.target.value)} placeholder="19.99" />
          </Field>
          <Field label="Compare-at ($)" hint="Optional — shows a strikethrough.">
            <input className={inputCls} type="number" step="0.01" value={f.compareAt} onChange={(e) => set("compareAt", e.target.value)} placeholder="24.99" />
          </Field>
          <Field label="Rating (0–5)">
            <input className={inputCls} type="number" step="0.1" min="0" max="5" value={f.rating} onChange={(e) => set("rating", e.target.value)} />
          </Field>
          <Field label="Review count">
            <input className={inputCls} type="number" value={f.reviewCount} onChange={(e) => set("reviewCount", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Merchandising */}
      <Section title="Merchandising">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Badge" hint='e.g. "Best Seller", "New"'>
            <input className={inputCls} value={f.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Best Seller" />
          </Field>
          <Field label="Category">
            <input className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
          <Field label="Pack size">
            <input className={inputCls} value={f.packSize} onChange={(e) => set("packSize", e.target.value)} />
          </Field>
          <Field label="Finish colour">
            <div className="flex items-center gap-2">
              <input type="color" value={f.accent} onChange={(e) => set("accent", e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
              <input className={inputCls} value={f.accent} onChange={(e) => set("accent", e.target.value)} />
            </div>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <Toggle label="Best seller" checked={f.bestSeller} onChange={(v) => set("bestSeller", v)} />
          <Toggle label="Visible on site" checked={f.active} onChange={(v) => set("active", v)} />
        </div>
      </Section>

      {/* Features */}
      <Section title="Features">
        <div className="space-y-2">
          {f.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputCls}
                value={feat}
                onChange={(e) => set("features", f.features.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="Crystal Clear"
              />
              <button type="button" onClick={() => set("features", f.features.filter((_, j) => j !== i))} className={iconBtn}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <AddButton onClick={() => set("features", [...f.features, ""])}>Add feature</AddButton>
      </Section>

      {/* Specs */}
      <Section title="Specifications">
        <div className="space-y-2">
          {f.specs.map((spec, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={`${inputCls} sm:w-1/3`}
                value={spec.label}
                onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                placeholder="Material"
              />
              <input
                className={inputCls}
                value={spec.value}
                onChange={(e) => set("specs", f.specs.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                placeholder="Optical-grade polymer"
              />
              <button type="button" onClick={() => set("specs", f.specs.filter((_, j) => j !== i))} className={iconBtn}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <AddButton onClick={() => set("specs", [...f.specs, { label: "", value: "" }])}>Add spec</AddButton>
      </Section>

      {/* Save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Link href="/admin/products" className="text-sm font-semibold text-slate-500 hover:text-navy">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-bold text-white shadow-premium transition hover:bg-brand-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : mode === "new" ? "Create product" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-navy transition placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";
const iconBtn =
  "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block last:mb-0">
      <span className="mb-1.5 block text-sm font-semibold text-navy">
        {label} {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2.5">
      <span
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-brand-600" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
      <span className="text-sm font-semibold text-navy">{label}</span>
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
    >
      <Plus className="h-4 w-4" /> {children}
    </button>
  );
}
