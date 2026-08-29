import { Suspense } from "react";
import ProductsManager from "./ProductsManager";

export const dynamic = "force-dynamic";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-slate-400">Loading…</div>}>
      <ProductsManager />
    </Suspense>
  );
}
