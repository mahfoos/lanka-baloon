import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "slb_session";

/**
 * Gatekeeper for the ERP. The root path ("/") is the operator login page and is
 * public; every other route requires a session cookie. The Edge runtime only
 * checks for the cookie's presence — server components re-verify the HMAC
 * signature via getSession().
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(SESSION_COOKIE);
  const isLogin = pathname === "/";

  // Not signed in and trying to reach a protected route → send to login.
  if (!hasSession && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = `?from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Already signed in and sitting on the login page → go to the dashboard.
  if (hasSession && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Exclude the auth API, Next internals and public brand assets from the gate.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|icon.png|logo.png).*)"],
};
