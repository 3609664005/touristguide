import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = NextResponse.json({ ok: true, time: Date.now() });
  response.cookies.set("test-cookie", "hello-world", { path: "/", maxAge: 60, httpOnly: false });
  return response;
}