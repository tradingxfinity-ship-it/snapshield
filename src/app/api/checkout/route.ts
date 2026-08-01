import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";

const FREE_SHIP_THRESHOLD = 50;

type IncomingItem = { slug: string; qty: number; color?: string };

export async function POST(req: Request) {
  let body: { items?: IncomingItem[]; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Build line items from the trusted server catalog — never from client prices.
  const line_items: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description?: string };
    };
  }[] = [];
  let subtotal = 0;

  for (const it of items) {
    const product = getProduct(it.slug);
    if (!product) continue;
    const qty = Math.min(Math.max(1, Math.floor(Number(it.qty) || 1)), 20);
    subtotal += product.price * qty;
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description: it.color ? `Finish: ${it.color}` : product.tagline,
        },
      },
    });
  }

  if (line_items.length === 0) {
    return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
  }

  const stripe = getStripe();
  // No Stripe key configured yet → tell the client to run the demo flow.
  if (!stripe) return NextResponse.json({ demo: true });

  const origin =
    req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const shippingCents = subtotal >= FREE_SHIP_THRESHOLD ? 0 : 699;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      // Stripe shows card + Apple Pay + Google Pay automatically; enable PayPal
      // in the Stripe Dashboard (Settings → Payment methods) to add it here too.
      billing_address_collection: "auto",
      customer_email: body.email || undefined,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCents, currency: "usd" },
            display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { source: "snapshield-web" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
