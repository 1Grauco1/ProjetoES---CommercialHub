import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { isAuthPage, isPublicPath } from "@/src/utils/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = Boolean(req.auth);

  if (!isLoggedIn && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.webp$|.*\\.gif$|.*\\.avif$|.*\\.ico$).*)",
  ],
};
