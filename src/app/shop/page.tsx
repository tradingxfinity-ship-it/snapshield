import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Premium PSA Slab Guards",
  description:
    "Browse Snap Shield's premium guards, display cases, and bundles — all engineered exclusively for PSA graded trading cards.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopClient />
    </Suspense>
  );
}
