import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Stripe webhook — Stripe calls this after a payment completes so orders are
 * confirmed server-side (never trust the browser redirect alone).
 *
 * Set STRIPE_WEBHOOK_SECRET and point a Stripe webhook at /api/webhook.
 * Locally: `stripe listen --forward-to localhost:3000/api/webhook`
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ skipped: true });

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig!, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // TODO: persist the order to your database here (order id, email, amount, items).
    console.log("✅ Order paid", {
      id: session.id,
      email: session.customer_details?.email,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  }

  return NextResponse.json({ received: true });
}
