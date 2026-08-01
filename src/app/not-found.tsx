import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-6 text-center">
      <p className="font-display text-8xl font-bold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy">This card slipped out of its guard</h1>
      <p className="mt-2 max-w-sm text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to protecting what matters.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Back Home</ButtonLink>
        <ButtonLink href="/shop" variant="secondary">Shop Guards</ButtonLink>
      </div>
      <Link href="/" className="mt-6 text-sm font-semibold text-brand-600">
        SNAP SHIELD
      </Link>
    </div>
  );
}
