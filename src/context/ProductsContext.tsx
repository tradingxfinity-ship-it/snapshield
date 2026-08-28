"use client";

import { createContext, useContext, useMemo } from "react";
import { products as staticProducts, type Product } from "@/lib/products";

const ProductsContext = createContext<Product[]>(staticProducts);

/**
 * Makes the live product catalogue available to client components. Fed by the
 * root layout with products fetched from the DB (falling back to the built-in
 * static list), so dashboard edits flow through to the storefront.
 */
export function ProductsProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const value = products && products.length ? products : staticProducts;
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts(): Product[] {
  return useContext(ProductsContext);
}

/** Derived { slug: {src, hover} } image map, kept for existing call-sites. */
export function useShopImages(): Record<string, { src: string; hover: string }> {
  const products = useProducts();
  return useMemo(
    () =>
      Object.fromEntries(
        products
          .filter((p) => p.image)
          .map((p) => [p.slug, { src: p.image, hover: p.image }])
      ),
    [products]
  );
}
