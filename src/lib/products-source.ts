import "server-only";
import { unstable_cache } from "next/cache";
import {
  products as staticProducts,
  rowToProduct,
  type Product,
  type ProductRow,
} from "./products";
import { supabasePublic, supabaseAdmin } from "./supabase";

export const PRODUCTS_TAG = "products";

/**
 * Server-side product source. Reads from Supabase when configured, otherwise
 * falls back to the built-in static catalogue so the site always renders.
 *
 * Prefers the admin (service-role) client on the server so drafts/inactive
 * rows are visible to server rendering if needed; falls back to the anon
 * client (active rows only).
 */
function client() {
  return supabaseAdmin() ?? supabasePublic();
}

async function fetchProducts(): Promise<Product[]> {
  const db = client();
  if (!db) return staticProducts;
  try {
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return staticProducts;
    return (data as ProductRow[]).map(rowToProduct);
  } catch (err) {
    console.error("[products-source] falling back to static catalogue:", err);
    return staticProducts;
  }
}

/**
 * Cached across requests and tagged so admin writes can invalidate it
 * (`revalidateTag(PRODUCTS_TAG)`), giving instant freshness on edits while
 * keeping storefront reads cheap. Revalidates at most every 60s as a backstop.
 */
export const getProducts = unstable_cache(fetchProducts, ["products-all"], {
  tags: [PRODUCTS_TAG],
  revalidate: 60,
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}
