import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Youtube, Facebook, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Slabs", href: "/shop" },
      { label: "Best Sellers", href: "/shop?filter=best" },
      { label: "New Arrivals", href: "/shop" },
      { label: "Slab Guards", href: "/shop?category=Slab%20Guards" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/#why" },
      { label: "Why Snap Shield", href: "/#why" },
      { label: "Reviews", href: "/#reviews" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/#faq" },
      { label: "Returns", href: "/#faq" },
      { label: "Contact", href: "/#faq" },
      { label: "Track Order", href: "/#faq" },
    ],
  },
];

const trust = [
  { icon: ShieldCheck, label: "PSA-only engineering" },
  { icon: Truck, label: "Free shipping over $50" },
  { icon: RefreshCw, label: "30-day guarantee" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-x">
        {/* trust bar */}
        <div className="grid gap-4 border-b border-slate-100 py-8 sm:grid-cols-3">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2.5 text-sm font-semibold text-slate-600">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <t.icon className="h-4.5 w-4.5" />
              </span>
              {t.label}
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center" aria-label="Snap Shield home">
              <Image src="/logo-full.png" alt="Snap Shield" width={160} height={72} className="h-14 w-auto object-contain" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-500">
              Premium protective guards engineered exclusively for PSA graded trading cards.
              Protect what matters.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-full bg-mist text-slate-500 transition hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-navy">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-slate-500 transition hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 py-8 sm:flex-row">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Snap Shield. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/#faq" className="transition hover:text-navy">Privacy Policy</Link>
            <Link href="/#faq" className="transition hover:text-navy">Terms</Link>
            <Link href="/#faq" className="transition hover:text-navy">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
