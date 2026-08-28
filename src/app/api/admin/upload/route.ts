import { NextResponse } from "next/server";
import { supabaseAdmin, PRODUCT_BUCKET } from "@/lib/supabase";
import { slugify } from "@/lib/admin-products";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

/** Upload a product image to Supabase Storage and return its public URL. */
export async function POST(req: Request) {
  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add your keys to enable uploads." },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 8 MB." }, { status: 413 });
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "product";
  const path = `${base}-${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await db.storage
    .from(PRODUCT_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = db.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
