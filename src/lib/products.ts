export type ColorOption = {
  name: string;
  hex: string;
  ring: string;
};

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  category: string;
  bestSeller?: boolean;
  colors: ColorOption[];
  accent: string; // base slab tint
  features: string[];
  specs: { label: string; value: string }[];
  packSize: string;
};

export const products: Product[] = [
  {
    slug: "snap-shield-pro",
    name: "Snap Shield Pro",
    tagline: "The flagship guard for PSA slabs",
    description:
      "Precision-engineered protection that snaps around your PSA slab with a satisfying, secure click. Optical-grade clarity, museum-level UV defense, and a form that feels like it was machined for your card.",
    price: 24,
    compareAt: 32,
    rating: 4.9,
    reviewCount: 1284,
    badge: "Best Seller",
    category: "Slab Guards",
    bestSeller: true,
    accent: "#2563EB",
    colors: [
      { name: "Arctic Clear", hex: "#e5edff", ring: "#93c5fd" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Midnight Navy", hex: "#0F172A", ring: "#1e293b" },
      { name: "Smoke", hex: "#64748b", ring: "#475569" },
    ],
    features: ["Crystal Clear", "Perfect PSA Fit", "Scratch Resistant", "UV Guard"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Material", value: "Optical-grade polymer" },
      { label: "Thickness", value: "1.8mm reinforced shell" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Closure", value: "Precision snap lock" },
      { label: "Weight", value: "42g" },
    ],
    packSize: "Single guard",
  },
  {
    slug: "snap-shield-vault",
    name: "Snap Shield Vault",
    tagline: "Maximum defense for grail cards",
    description:
      "For the cards you'd never replace. A heavier reinforced shell with impact-absorbing corners and a locking seal — engineered for investors who treat cardboard like gold.",
    price: 34,
    rating: 4.9,
    reviewCount: 742,
    badge: "Premium",
    category: "Slab Guards",
    accent: "#0F172A",
    colors: [
      { name: "Midnight Navy", hex: "#0F172A", ring: "#1e293b" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Titanium", hex: "#94a3b8", ring: "#64748b" },
    ],
    features: ["Impact Armor", "Locking Seal", "Anti-Static", "UV Guard"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Material", value: "Reinforced impact polymer" },
      { label: "Thickness", value: "2.6mm armored shell" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Closure", value: "Dual locking seal" },
      { label: "Weight", value: "58g" },
    ],
    packSize: "Single guard",
  },
  {
    slug: "snap-shield-display",
    name: "Snap Shield Display",
    tagline: "Show it off, keep it flawless",
    description:
      "A stand-integrated guard that lets your PSA slab float on a shelf at the perfect angle. Protection and presentation in one seamless piece.",
    price: 29,
    rating: 4.8,
    reviewCount: 531,
    badge: "New",
    category: "Display",
    accent: "#3B82F6",
    colors: [
      { name: "Arctic Clear", hex: "#e5edff", ring: "#93c5fd" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Snow White", hex: "#f8fafc", ring: "#cbd5e1" },
    ],
    features: ["Built-in Stand", "Crystal Clear", "Perfect PSA Fit", "Scratch Resistant"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Material", value: "Optical-grade polymer" },
      { label: "Display Angle", value: "12° viewing tilt" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Closure", value: "Precision snap lock" },
      { label: "Weight", value: "61g" },
    ],
    packSize: "Single guard + stand",
  },
  {
    slug: "snap-shield-collector-pack",
    name: "Collector Pack",
    tagline: "Five guards, one flawless collection",
    description:
      "The smart way to protect a growing collection. Five Snap Shield Pro guards bundled at a collector's price — because grails rarely travel alone.",
    price: 99,
    compareAt: 120,
    rating: 5.0,
    reviewCount: 968,
    badge: "Value",
    category: "Bundles",
    bestSeller: true,
    accent: "#1d4ed8",
    colors: [
      { name: "Arctic Clear", hex: "#e5edff", ring: "#93c5fd" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Mixed Set", hex: "#60a5fa", ring: "#2563EB" },
    ],
    features: ["5-Pack Value", "Crystal Clear", "Perfect PSA Fit", "UV Guard"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Pack Contents", value: "5× Snap Shield Pro" },
      { label: "Material", value: "Optical-grade polymer" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Closure", value: "Precision snap lock" },
      { label: "Savings", value: "Save 18% vs single" },
    ],
    packSize: "5 guards",
  },
  {
    slug: "snap-shield-travel-case",
    name: "Travel Case",
    tagline: "Move grails without a second thought",
    description:
      "A rigid, foam-lined case built around Snap Shield guards. Carry up to eight PSA slabs to shows and meetups with zero anxiety.",
    price: 49,
    rating: 4.8,
    reviewCount: 312,
    category: "Cases",
    accent: "#334155",
    colors: [
      { name: "Midnight Navy", hex: "#0F172A", ring: "#1e293b" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
    ],
    features: ["Holds 8 Slabs", "Foam Lined", "Impact Armor", "Lockable"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Capacity", value: "Up to 8 guarded slabs" },
      { label: "Material", value: "Rigid EVA + foam" },
      { label: "Closure", value: "Zip + optional lock" },
      { label: "Weight", value: "540g" },
      { label: "Water Resist", value: "Splash resistant" },
    ],
    packSize: "1 case",
  },
  {
    slug: "snap-shield-clean-kit",
    name: "Clean Kit",
    tagline: "Keep every guard flawless",
    description:
      "Anti-static microfiber cloths and a streak-free optical spray, formulated to keep your Snap Shield guards looking showroom-new.",
    price: 19,
    rating: 4.7,
    reviewCount: 208,
    category: "Care",
    accent: "#60a5fa",
    colors: [{ name: "Standard", hex: "#e5edff", ring: "#93c5fd" }],
    features: ["Anti-Static", "Streak-Free", "Scratch Safe", "Collector Approved"],
    specs: [
      { label: "Contents", value: "2 cloths + 60ml spray" },
      { label: "Formula", value: "Alcohol-free optical" },
      { label: "Safe For", value: "All Snap Shield guards" },
      { label: "Cloth", value: "Ultra-fine microfiber" },
    ],
    packSize: "1 kit",
  },
  {
    slug: "snap-shield-grip",
    name: "Snap Shield Grip",
    tagline: "One-touch magnetic hold",
    description:
      "A magnetic one-touch guard that opens and closes with a satisfying snap — no screws, no tools. Slide your PSA slab in and lock it with a single press.",
    price: 27,
    rating: 4.8,
    reviewCount: 447,
    badge: "New",
    category: "Slab Guards",
    accent: "#2563EB",
    colors: [
      { name: "Arctic Clear", hex: "#e5edff", ring: "#93c5fd" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Midnight Navy", hex: "#0F172A", ring: "#1e293b" },
    ],
    features: ["One-Touch Magnetic", "Crystal Clear", "Perfect PSA Fit", "Scratch Resistant"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Closure", value: "One-touch magnetic" },
      { label: "Material", value: "Optical-grade polymer" },
      { label: "Thickness", value: "2.0mm shell" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Weight", value: "48g" },
    ],
    packSize: "Single guard",
  },
  {
    slug: "snap-shield-frame",
    name: "Snap Shield Frame",
    tagline: "Wall-mounted grail display",
    description:
      "Turn your grails into wall art. A premium frame engineered to hold a guarded PSA slab flush against the wall, with hidden mounting hardware and UV-safe clarity.",
    price: 39,
    rating: 4.9,
    reviewCount: 286,
    badge: "Premium",
    category: "Display",
    accent: "#1d4ed8",
    colors: [
      { name: "Snow White", hex: "#f8fafc", ring: "#cbd5e1" },
      { name: "Midnight Navy", hex: "#0F172A", ring: "#1e293b" },
      { name: "Electric Blue", hex: "#2563EB", ring: "#1d4ed8" },
    ],
    features: ["Wall Mounted", "Crystal Clear", "UV Guard", "Collector Approved"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Mounting", value: "Hidden wall bracket" },
      { label: "Material", value: "Aluminum + optical polymer" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Orientation", value: "Portrait or landscape" },
      { label: "Weight", value: "180g" },
    ],
    packSize: "1 frame",
  },
  {
    slug: "snap-shield-5-color-bundle",
    name: "5-Color Collector Bundle",
    tagline: "Five finishes, one flawless set",
    description:
      "Five premium Snap Shield guards in five collector finishes — Ruby, Gold, Emerald, Sapphire, and Amethyst. Colour-code your PSA collection, protect a whole shelf, and save 10%.",
    price: 108,
    compareAt: 120,
    rating: 4.9,
    reviewCount: 640,
    badge: "Save 10%",
    category: "Bundles",
    bestSeller: true,
    accent: "#2563EB",
    colors: [
      { name: "Ruby", hex: "#dc2626", ring: "#b91c1c" },
      { name: "Gold", hex: "#d97706", ring: "#b45309" },
      { name: "Emerald", hex: "#16a34a", ring: "#15803d" },
      { name: "Sapphire", hex: "#2563EB", ring: "#1d4ed8" },
      { name: "Amethyst", hex: "#7c3aed", ring: "#6d28d9" },
    ],
    features: ["5 Finishes", "Save 10%", "Crystal Clear", "Perfect PSA Fit"],
    specs: [
      { label: "Compatibility", value: "PSA Standard Slabs" },
      { label: "Pack Contents", value: "5× guards, 5 finishes" },
      { label: "Material", value: "Optical-grade polymer" },
      { label: "UV Protection", value: "99% UV-A / UV-B" },
      { label: "Closure", value: "Precision snap lock" },
      { label: "Savings", value: "Save 10% vs single" },
    ],
    packSize: "5 guards",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const categories = ["All", "Slab Guards", "Display", "Bundles", "Cases", "Care"];

// Real product photography — { default, hover } per product slug.
export const shopImages: Record<string, { src: string; hover: string }> = {
  "snap-shield-pro": { src: "/shop-blue.png", hover: "/shop-blue-hover.png" },
  "snap-shield-vault": { src: "/shop-black.png", hover: "/shop-black-hover.png" },
  "snap-shield-display": { src: "/shop-white.png", hover: "/shop-white-hover.png" },
  "snap-shield-collector-pack": { src: "/shop-3set.png", hover: "/shop-3set-hover.png" },
  "snap-shield-travel-case": { src: "/shop-black.png", hover: "/shop-black-hover.png" },
  "snap-shield-clean-kit": { src: "/shop-white.png", hover: "/shop-white-hover.png" },
  "snap-shield-grip": { src: "/shop-blue.png", hover: "/shop-blue-hover.png" },
  "snap-shield-frame": { src: "/shop-white.png", hover: "/shop-white-hover.png" },
  "snap-shield-5-color-bundle": { src: "/shop-3set.png", hover: "/shop-3set-hover.png" },
};
