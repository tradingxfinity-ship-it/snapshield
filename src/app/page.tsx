import Hero from "@/components/sections/Hero";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import WhySnapShield from "@/components/sections/WhySnapShield";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Reviews from "@/components/sections/Reviews";
import FAQ from "@/components/sections/FAQ";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhySnapShield />
      <ProductShowcase />
      <Reviews />
      <FAQ />
      <Newsletter />
    </>
  );
}
