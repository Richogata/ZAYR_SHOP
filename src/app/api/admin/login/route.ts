import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD ?? "ZayrAdmin2026!";

  if (password !== expected) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  const secret = process.env.ADMIN_SECRET ?? expected;
  const cookieStore = await cookies();
  cookieStore.set("admin_token", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ success: true, token: secret });
}
