import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { ProductRow } from "@/lib/products";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = supabaseAdmin();
  if (!db) notFound();

  const { data } = await db.from("products").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();

  return <ProductForm mode="edit" initial={data as ProductRow} />;
}
