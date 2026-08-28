import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_MS, createSessionToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json(
      { error: "Admin login is not configured. Set ADMIN_PASSWORD in your environment." },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supplied = body.password ?? "";
  // constant-time compare
  let diff = supplied.length ^ password.length;
  for (let i = 0; i < Math.max(supplied.length, password.length); i++) {
    diff |= (supplied.charCodeAt(i) || 0) ^ (password.charCodeAt(i) || 0);
  }
  if (diff !== 0) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
