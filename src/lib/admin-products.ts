import "server-only";
import type { ProductRow } from "./products";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

type Input = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : v == null ? fallback : String(v));
const optNum = (v: unknown): number | null => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const num = (v: unknown, fallback = 0): number => {
  const n = optNum(v);
  return n === null ? fallback : n;
};
const bool = (v: unknown) => v === true || v === "true" || v === "on" || v === 1;

const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => str(x)).filter((s) => s.trim() !== "") : [];

const asSpecs = (v: unknown): { label: string; value: string }[] =>
  Array.isArray(v)
    ? v
        .map((x) => {
          const o = (x ?? {}) as Record<string, unknown>;
          return { label: str(o.label), value: str(o.value) };
        })
        .filter((s) => s.label.trim() !== "" || s.value.trim() !== "")
    : [];

/**
 * Turn arbitrary dashboard form input into a validated products row.
 * `existingSlug` is passed on edit so the slug (primary key) stays stable.
 */
export function normalizeProductInput(
  input: Input,
  existingSlug?: string
): { row: ProductRow; error?: string } {
  const name = str(input.name).trim();
  if (!name) return { row: {} as ProductRow, error: "Name is required." };

  const slug = existingSlug || slugify(str(input.slug).trim() || name);
  if (!slug) return { row: {} as ProductRow, error: "Could not derive a slug from the name." };

  const accent = str(input.accent, "#2563EB") || "#2563EB";
  const colors = Array.isArray(input.colors) && input.colors.length
    ? (input.colors as ProductRow["colors"])
    : [{ name, hex: accent, ring: accent }];

  const badge = str(input.badge).trim();

  const row: ProductRow = {
    slug,
    name,
    tagline: str(input.tagline),
    description: str(input.description),
    price: num(input.price),
    compare_at: optNum(input.compareAt ?? input.compare_at),
    rating: num(input.rating, 4.8),
    review_count: Math.round(num(input.reviewCount ?? input.review_count, 0)),
    badge: badge || null,
    category: str(input.category, "Slab Guards") || "Slab Guards",
    best_seller: bool(input.bestSeller ?? input.best_seller),
    accent,
    image: str(input.image),
    features: asStringArray(input.features),
    specs: asSpecs(input.specs),
    colors,
    pack_size: str(input.packSize ?? input.pack_size, "Single guard") || "Single guard",
    sort_order: Math.round(num(input.sortOrder ?? input.sort_order, 0)),
    active: input.active === undefined ? true : bool(input.active),
  };

  return { row };
}
