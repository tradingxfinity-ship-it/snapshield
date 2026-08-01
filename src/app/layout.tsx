import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://snapshield.example"),
  title: {
    default: "Snap Shield — Premium Guards for PSA Graded Cards",
    template: "%s · Snap Shield",
  },
  description:
    "Premium protective guards engineered exclusively for PSA graded trading cards. Crystal-clear, scratch-resistant, and a perfect PSA fit for Pokémon, sports, and TCG collectors.",
  keywords: [
    "PSA slab protector",
    "graded card guard",
    "PSA case protector",
    "Pokemon graded card protection",
    "sports card slab guard",
    "premium card protection",
  ],
  authors: [{ name: "Snap Shield" }],
  openGraph: {
    title: "Snap Shield — Premium Guards for PSA Graded Cards",
    description:
      "Protect what matters. Premium guards engineered exclusively for PSA graded slabs.",
    type: "website",
    siteName: "Snap Shield",
  },
  twitter: {
    card: "summary_large_image",
    title: "Snap Shield — Premium Guards for PSA Graded Cards",
    description: "Premium guards engineered exclusively for PSA graded slabs.",
  },
  robots: { index: true, follow: true },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Snap Shield",
  description: "Premium protective guards engineered exclusively for PSA graded trading cards.",
  slogan: "Protect What Matters.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="bg-white font-sans text-navy antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
