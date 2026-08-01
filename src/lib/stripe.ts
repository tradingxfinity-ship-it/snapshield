import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Returns a configured Stripe client, or null when STRIPE_SECRET_KEY isn't set.
 * Keeping it lazy means the app (and the demo checkout) works with no keys.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);
