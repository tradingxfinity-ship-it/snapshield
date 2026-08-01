# SNAP SHIELD

Premium e-commerce experience for protective guards engineered **exclusively for PSA graded trading cards**. Built to feel like Apple meets premium collector accessories.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — custom brand tokens (blue `#2563EB`, navy `#0F172A`, mist `#F8FAFC`)
- **Framer Motion** — reveal/blur/parallax/stagger animations, ripple buttons, cart & drawer springs
- **Lucide** icons
- Fonts: **Inter** (body) + **Space Grotesk** (display), via `next/font`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all routes prerendered/SSG)
npm start
```

## Structure

```
src/
  app/
    layout.tsx              # fonts, SEO metadata, JSON-LD, providers
    page.tsx                # homepage (all sections)
    shop/                   # catalog: filtering, sorting, breadcrumbs, pagination
    product/[slug]/         # PDP: gallery + zoom, color/qty, specs, reviews, related, recently viewed
    sitemap.ts / robots.ts  # SEO
  components/
    Navbar.tsx              # sticky glass nav, mega menu, search overlay, mobile drawer
    CartDrawer.tsx          # mini cart, free-ship progress, upsells
    Footer.tsx
    sections/               # Hero, FeaturedProducts, WhySnapShield, ProductShowcase,
                            # CollectorGallery, Reviews, FAQ, Newsletter
    ui/                     # Button (ripple), ProductCard, SlabVisual (SVG), Reveal
  context/CartContext.tsx   # cart + wishlist, localStorage persistence
  lib/products.ts           # product catalog (PSA-only)
```

## Notes

- **PSA only** — the copy, FAQ, and specs make explicit that Snap Shield does **not** make BGS or CGC guards.
- Product imagery is a fully self-contained **SVG PSA slab** (`SlabVisual`) that stays razor-sharp at any size and re-tints per finish — no external photography needed. Swap in real photos later by replacing `SlabVisual` usages.
- Cart, wishlist, and recently-viewed persist in `localStorage`. Checkout is a front-end demo flow (no payment backend wired).
