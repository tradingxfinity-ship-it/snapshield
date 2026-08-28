import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts, productToRow, type ProductRow } from "@/lib/products";
import { normalizeProductInput } from "@/lib/admin-products";
import { PRODUCTS_TAG } from "@/lib/products-source";

export const dynamic = "force-dynamic";

/** List all products (including inactive) for management. */
export async function GET() {
  const db = supabaseAdmin();
  if (!db) {
    // Not configured yet — show the static catalogue read-only.
    const rows = staticProducts.map((p, i) => productToRow(p, i));
    return NextResponse.json({ products: rows, source: "static" });
  }
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: (data ?? []) as ProductRow[], source: "db" });
}

/** Create a product. */
export async function POST(req: Request) {
  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add your keys to enable saving." },
      { status: 503 }
    );
  }

  let input: Record<string, unknown>;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { row, error } = normalizeProductInput(input);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = await db.from("products").select("slug").eq("slug", row.slug).maybeSingle();
  if (existing.data) {
    return NextResponse.json(
      { error: `A product with slug "${row.slug}" already exists.` },
      { status: 409 }
    );
  }

  const { data, error: insertError } = await db.from("products").insert(row).select().single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  revalidateTag(PRODUCTS_TAG);
  return NextResponse.json({ product: data });
}
