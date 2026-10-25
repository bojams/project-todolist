import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnProfile = req.nextUrl.pathname.startsWith('/profile');
  const isOnLogin = req.nextUrl.pathname.startsWith('/login');

  if (isOnProfile && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
});

export const config = {
  matcher: ['/profile', '/login'],
};