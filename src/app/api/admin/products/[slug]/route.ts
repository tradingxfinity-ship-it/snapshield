import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeProductInput } from "@/lib/admin-products";

export const dynamic = "force-dynamic";

function requireDb() {
  const db = supabaseAdmin();
  if (!db) {
    return {
      db: null,
      res: NextResponse.json(
        { error: "Supabase is not configured. Add your keys to enable saving." },
        { status: 503 }
      ),
    };
  }
  return { db, res: null };
}

/** Fetch one product (for the edit form). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db, res } = requireDb();
  if (!db) return res;
  const { data, error } = await db.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ product: data });
}

/** Update a product. Slug (primary key) stays fixed. */
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db, res } = requireDb();
  if (!db) return res;

  let input: Record<string, unknown>;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { row, error } = normalizeProductInput(input, slug);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const { slug: _omit, ...updates } = row;
  const { data, error: updateError } = await db
    .from("products")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

/** Delete a product. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { db, res } = requireDb();
  if (!db) return res;
  const { error } = await db.from("products").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
