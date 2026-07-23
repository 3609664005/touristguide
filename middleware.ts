import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";

const SESSION_PASSWORD = process.env.SESSION_SECRET || "token-secret-at-least-32-chars-long!!";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  if (host === "touristguide.cn") {
    const newUrl = new URL(pathname + request.nextUrl.search, "https://www.touristguide.cn");
    return NextResponse.redirect(newUrl, 301);
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const publicPaths = ["/admin/login", "/admin/api/"];
  const isPublic = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  if (isPublic) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const token = authHeader.slice(7);
    const data = await unsealData<{ isLoggedIn: boolean }>(token, { password: SESSION_PASSWORD });
    if (!data.isLoggedIn) throw new Error("not logged in");
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};