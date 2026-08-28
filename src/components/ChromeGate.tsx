"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the storefront chrome (navbar, footer, cart drawer) on the admin area,
 * which renders inside its own branded shell.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
