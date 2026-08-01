"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, ChevronLeft, Truck, ShieldCheck, CreditCard, Apple, ShoppingBag } from "lucide-react";
import { useCart, FREE_SHIP_THRESHOLD } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";

type Method = "card" | "paypal" | "apple";

const methods: { id: Method; label: string; desc: string }[] = [
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex & more" },
  { id: "paypal", label: "PayPal", desc: "Pay with your PayPal balance" },
  { id: "apple", label: "Apple Pay", desc: "Pay with Face ID or Touch ID" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [method, setMethod] = useState<Method>("card");
  const [email, setEmail] = useState("");
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : 6.99;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, color: i.color })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // → real Stripe Checkout
        return;
      }
      if (data.demo) {
        // No Stripe keys configured yet — run the demo confirmation.
        setPlaced(true);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- success ----
  if (placed) {
    return (
      <div className="min-h-screen bg-mist pt-[92px]">
        <div className="container-x flex flex-col items-center py-24 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 14 }}
            className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-white shadow-glow"
          >
            <Check className="h-10 w-10" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-navy">Order confirmed</h1>
          <p className="mt-3 max-w-md text-slate-600">
            Thank you! Your Snap Shield order is on its way. A confirmation has been sent to your inbox with tracking details.
          </p>
          <div className="mt-8 flex gap-3">
            <ButtonLink href="/shop">Continue Shopping</ButtonLink>
            <ButtonLink href="/" variant="secondary">Back Home</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  // ---- empty ----
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-mist pt-[92px]">
        <div className="container-x flex flex-col items-center py-24 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
            <ShoppingBag className="h-8 w-8 text-slate-300" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-navy">Your cart is empty</h1>
          <p className="mt-2 text-slate-600">Add a guard to your cart before checking out.</p>
          <ButtonLink href="/shop" className="mt-6">Browse Shop</ButtonLink>
        </div>
      </div>
    );
  }

  // ---- checkout ----
  return (
    <div className="min-h-screen bg-mist pt-[92px]">
      <div className="container-x py-10 lg:py-14">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-navy">
          <ChevronLeft className="h-4 w-4" /> Back to shop
        </Link>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-navy">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* left — details */}
          <div className="space-y-8">
            {/* contact */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-lg font-bold text-navy">Contact & shipping</h2>
              <div className="mt-5 grid gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none transition focus:border-brand-500"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="First name" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                  <input placeholder="Last name" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                </div>
                <input placeholder="Address" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input placeholder="City" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                  <input placeholder="ZIP" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                  <input placeholder="Country" className="h-12 rounded-xl border border-slate-200 px-4 text-navy outline-none focus:border-brand-500" />
                </div>
              </div>
            </section>

            {/* payment */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy">Payment method</h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Lock className="h-3.5 w-3.5" /> Secure & encrypted
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {methods.map((m) => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        active ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                          active ? "border-brand-600" : "border-slate-300"
                        }`}
                      >
                        {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-navy">{m.label}</span>
                        <span className="block text-xs text-slate-500">{m.desc}</span>
                      </span>
                      <PayMark method={m.id} />
                    </button>
                  );
                })}
              </div>

              {/* method-specific area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={method}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {method === "card" && (
                    <p className="mt-5 flex items-start gap-2 rounded-2xl bg-mist p-4 text-sm text-slate-600">
                      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      Your card details are entered on the next step via Stripe&apos;s PCI-secure page — we never store or see your card number.
                    </p>
                  )}
                  {method === "paypal" && (
                    <p className="mt-5 rounded-2xl bg-mist p-4 text-sm text-slate-600">
                      You&apos;ll be securely redirected to PayPal to complete your purchase, then returned here to confirm.
                    </p>
                  )}
                  {method === "apple" && (
                    <p className="mt-5 rounded-2xl bg-mist p-4 text-sm text-slate-600">
                      Confirm your payment with Face ID or Touch ID on your Apple device — no card details needed.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>

          {/* right — summary */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-lg font-bold text-navy">Order summary</h2>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={item.slug + item.color} className="flex gap-3">
                    <span
                      className="grid h-14 w-12 shrink-0 place-items-center rounded-xl text-white/70"
                      style={{ background: `linear-gradient(135deg, ${item.accent}, #0f172a)` }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-bold text-navy">{item.name}</span>
                      <span className="text-xs text-slate-500">
                        {item.color} · Qty {item.qty}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-navy">{formatPrice(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                <Row label="Tax (est.)" value={formatPrice(tax)} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-base font-bold text-navy">Total</span>
                <span className="text-2xl font-extrabold text-navy">{formatPrice(total)}</span>
              </div>

              <Button onClick={placeOrder} size="lg" className="mt-6 w-full">
                {submitting
                  ? "Processing…"
                  : `${method === "paypal" ? "Continue with PayPal" : method === "apple" ? "Pay with Apple Pay" : "Pay"} ${formatPrice(total)}`}
              </Button>
              {error && <p className="mt-3 text-center text-sm font-medium text-red-500">{error}</p>}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-brand-600" /> 256-bit SSL secure checkout
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <Truck className="h-4 w-4 text-brand-600" />
                {shipping === 0 ? "Free shipping included" : `Add ${formatPrice(FREE_SHIP_THRESHOLD - subtotal)} for free shipping`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

/* small brand marks per payment method */
function PayMark({ method }: { method: Method }) {
  if (method === "paypal") {
    return (
      <span className="text-sm font-extrabold italic">
        <span style={{ color: "#003087" }}>Pay</span>
        <span style={{ color: "#009cde" }}>Pal</span>
      </span>
    );
  }
  if (method === "apple") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy">
        <Apple className="h-4 w-4 fill-navy" /> Pay
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5">
      {["Visa", "MC", "Amex"].map((b) => (
        <span key={b} className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-500">
          {b}
        </span>
      ))}
      <CreditCard className="ml-0.5 h-4 w-4 text-slate-400" />
    </span>
  );
}
