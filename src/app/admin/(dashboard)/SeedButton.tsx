"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** Inline "seed catalogue" action used inside the setup checklist. */
export default function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function seed() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error || "Seed failed.");
      return;
    }
    setMsg(`Seeded ${data.seeded} products.`);
    router.refresh();
  }

  return (
    <span className="ml-1 inline-flex items-center gap-2">
      <button
        onClick={seed}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading && <Loader2 className="h-3 w-3 animate-spin" />}
        Seed now
      </button>
      {msg && <span className="text-xs text-slate-600">{msg}</span>}
    </span>
  );
}
