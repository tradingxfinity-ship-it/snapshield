import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts, productToRow } from "@/lib/products";
import { PRODUCTS_TAG } from "@/lib/products-source";

export const dynamic = "force-dynamic";

/**
 * One-click seed: upsert the built-in static catalogue into the DB.
 * Safe to run more than once — existing slugs are updated in place.
 */
export async function POST() {
  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add your keys first." },
      { status: 503 }
    );
  }

  const rows = staticProducts.map((p, i) => productToRow(p, i));
  const { error, count } = await db
    .from("products")
    .upsert(rows, { onConflict: "slug", count: "exact" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag(PRODUCTS_TAG);
  return NextResponse.json({ ok: true, seeded: count ?? rows.length });
}
