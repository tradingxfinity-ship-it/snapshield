import { isSupabaseAdminConfigured } from "@/lib/supabase";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return <ProductForm mode="new" preview={!isSupabaseAdminConfigured} />;
}
