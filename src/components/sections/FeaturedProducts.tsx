import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import ProductCard from "../ui/ProductCard";
import { Reveal } from "../ui/Reveal";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);
  return (
    <section id="shop" className="relative py-24 lg:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-600">Featured</p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Guards built for grails
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-bold text-navy transition hover:text-brand-600"
            >
              View all products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
