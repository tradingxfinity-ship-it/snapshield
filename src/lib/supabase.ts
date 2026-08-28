import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase wiring for Snap Shield.
 *
 *  - `supabasePublic()`  → anon key, read-only (RLS-limited). Safe anywhere.
 *  - `supabaseAdmin()`   → service-role key, full write access. SERVER ONLY.
 *
 * When the env vars are not set the helpers return `null`, and the app falls
 * back to the built-in static product catalogue so the site keeps working.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const isSupabaseAdminConfigured = Boolean(url && serviceKey);

let _public: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function supabasePublic(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_public) _public = createClient(url, anonKey, { auth: { persistSession: false } });
  return _public;
}

/** SERVER ONLY — never import into a client component. */
export function supabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (!_admin) _admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _admin;
}

export const PRODUCT_BUCKET = "product-images";
