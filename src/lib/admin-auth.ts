/**
 * Shared-password admin session.
 *
 * A worker signs in with the single `ADMIN_PASSWORD`. On success we set a
 * signed, httpOnly cookie holding `${expiry}.${hmac}`. The HMAC is computed
 * with Web Crypto (SHA-256) so this module runs in both the Edge middleware
 * and Node route handlers.
 */

export const SESSION_COOKIE = "ss_admin";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "snap-shield-dev-secret-change-me"
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(sig);
}

export async function createSessionToken(ttlMs = SESSION_TTL_MS): Promise<string> {
  const expiry = Date.now() + ttlMs;
  const sig = await hmac(`admin.${expiry}`);
  return `${expiry}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expiry = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = await hmac(`admin.${expiry}`);
  // constant-time-ish compare
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/** Is a shared password configured? Used to warn during setup. */
export const isAdminConfigured = Boolean(process.env.ADMIN_PASSWORD);
