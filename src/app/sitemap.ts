import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products-source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://snapshield.example";
  const now = new Date();
  const products = await getProducts();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
