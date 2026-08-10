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
  accent: string; // finish colour
  image: string; // real slab photo
  features: string[];
  specs: { label: string; value: string }[];
  packSize: string;
};

/**
 * The Snap Shield slab line-up. Each finish is a photographed PSA slab guard in
 * public/slabs. Add a finish by dropping its photo in that folder and adding a
 * row here.
 */
type SlabDef = {
  name: string;
  file: string; // filename inside /public/slabs
  accent: string;
  tagline: string;
  price: number;
  compareAt?: number;
  badge?: string;
  bestSeller?: boolean;
  rating: number;
  reviews: number;
};

const slabDefs: SlabDef[] = [
  { name: "Amber", file: "amber.png", accent: "#f59e0b", tagline: "Warm amber edge with a premium glow", price: 19.99, compareAt: 24.99, badge: "Best Seller", bestSeller: true, rating: 4.9, reviews: 842 },
  { name: "Amethyst", file: "amethyst.png", accent: "#8b5cf6", tagline: "Deep amethyst purple for grail displays", price: 22.99, rating: 4.8, reviews: 511 },
  { name: "Berry Mix", file: "berrymix.png", accent: "#db2777", tagline: "A bold berry blend of pink and violet", price: 22.99, badge: "New", rating: 4.7, reviews: 143 },
  { name: "Cardinal", file: "cardinal.png", accent: "#b91c1c", tagline: "Rich cardinal red with matte depth", price: 19.99, rating: 4.8, reviews: 388 },
  { name: "Celtic", file: "celtic.png", accent: "#16a34a", tagline: "Classic Celtic green, clean and crisp", price: 19.99, rating: 4.8, reviews: 402 },
  { name: "Coral Tide", file: "coral-tide.png", accent: "#fb7185", tagline: "Coral-to-teal ocean gradient", price: 22.99, rating: 4.9, reviews: 267 },
  { name: "Cosmic", file: "cosmic.png", accent: "#7c3aed", tagline: "A cosmic purple-teal aurora finish", price: 24.99, compareAt: 29.99, badge: "Best Seller", bestSeller: true, rating: 5.0, reviews: 921 },
  { name: "Crimson", file: "crimson.png", accent: "#dc2626", tagline: "Vivid crimson for a statement slab", price: 19.99, rating: 4.7, reviews: 356 },
  { name: "Deep Freeze", file: "deepfreeze.png", accent: "#38bdf8", tagline: "Icy deep-freeze blue clarity", price: 19.99, rating: 4.8, reviews: 289 },
  { name: "Emerald", file: "emerald.png", accent: "#059669", tagline: "Luxe emerald green brilliance", price: 22.99, compareAt: 27.99, rating: 4.9, reviews: 474 },
  { name: "Flamingo", file: "flamingo.png", accent: "#ec4899", tagline: "Playful flamingo pink pop", price: 19.99, badge: "New", rating: 4.7, reviews: 118 },
  { name: "Glitz", file: "glitz.png", accent: "#eab308", tagline: "Gilded glitz with a golden shimmer", price: 24.99, rating: 4.9, reviews: 336 },
  { name: "Jade Mist", file: "jademist.png", accent: "#10b981", tagline: "Soft jade-mist green haze", price: 19.99, rating: 4.8, reviews: 244 },
  { name: "Lemon Lime", file: "lemon-lime.png", accent: "#84cc16", tagline: "Zesty lemon-lime brightness", price: 19.99, rating: 4.6, reviews: 176 },
  { name: "Permafrost", file: "permafrost.png", accent: "#7dd3fc", tagline: "Cool permafrost frosted blue", price: 19.99, rating: 4.8, reviews: 210 },
  { name: "Royalty", file: "royalty.png", accent: "#4338ca", tagline: "Regal royalty purple-blue", price: 24.99, compareAt: 29.99, badge: "Best Seller", bestSeller: true, rating: 5.0, reviews: 688 },
  { name: "Solstice", file: "solstice.png", accent: "#f97316", tagline: "Warm solstice sunset gradient", price: 22.99, rating: 4.8, reviews: 301 },
  { name: "Sunburst", file: "sunburst.png", accent: "#fbbf24", tagline: "Radiant sunburst yellow-orange", price: 19.99, rating: 4.7, reviews: 222 },
  { name: "Watermelon", file: "watermelon.png", accent: "#f43f5e", tagline: "Juicy watermelon pink and green", price: 22.99, compareAt: 27.99, rating: 4.9, reviews: 415 },
  { name: "Wildfire", file: "wildfire.png", accent: "#ea580c", tagline: "Blazing wildfire red-orange", price: 24.99, badge: "Best Seller", bestSeller: true, rating: 4.9, reviews: 559 },
];

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export const products: Product[] = slabDefs.map((d) => ({
  slug: slugify(d.name),
  name: d.name,
  tagline: d.tagline,
  description: `The ${d.name} finish brings a distinctive edge to your collection — a premium Snap Shield guard engineered exclusively for PSA graded slabs. Crystal-clear optics, a precise 0.1mm PSA fit, and 99% UV protection keep your grails flawless on display.`,
  price: d.price,
  compareAt: d.compareAt,
  rating: d.rating,
  reviewCount: d.reviews,
  badge: d.badge,
  category: "Slab Guards",
  bestSeller: d.bestSeller,
  accent: d.accent,
  image: `/slabs/${d.file}`,
  colors: [{ name: d.name, hex: d.accent, ring: d.accent }],
  features: ["Crystal Clear", "Perfect PSA Fit", "Scratch Resistant", "UV Guard"],
  specs: [
    { label: "Compatibility", value: "PSA Standard Slabs" },
    { label: "Finish", value: d.name },
    { label: "Material", value: "Optical-grade polymer" },
    { label: "Thickness", value: "1.8mm reinforced shell" },
    { label: "UV Protection", value: "99% UV-A / UV-B" },
    { label: "Closure", value: "Precision snap lock" },
  ],
  packSize: "Single guard",
}));

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const categories = ["All", "Slab Guards"];

// Real product photography per product slug (single hero shot per finish).
export const shopImages: Record<string, { src: string; hover: string }> = Object.fromEntries(
  products.map((p) => [p.slug, { src: p.image, hover: p.image }])
);
