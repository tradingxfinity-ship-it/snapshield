import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts, productToRow, type ProductRow } from "@/lib/products";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = supabaseAdmin();

  // No Supabase → preview mode using the built-in catalogue.
  if (!db) {
    const idx = staticProducts.findIndex((p) => p.slug === slug);
    if (idx === -1) notFound();
    return <ProductForm mode="edit" initial={productToRow(staticProducts[idx], idx)} preview />;
  }

  const { data } = await db.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();

  return <ProductForm mode="edit" initial={data as ProductRow} />;
}
