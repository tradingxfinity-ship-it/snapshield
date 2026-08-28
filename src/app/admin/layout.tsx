import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snap Shield Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 text-navy">{children}</div>;
}
