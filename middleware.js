import { NextResponse } from 'next/server'

 import { getToken } from "next-auth/jwt"
 //export { default } from "next-auth/middleware"
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow unauthenticated access to specific public routes
  if (
    !token &&
    (url.pathname.startsWith('/SignIn') ||
      url.pathname.startsWith('/SignUp') ||
      url.pathname.startsWith('/ManufacturerSignup') ||
      url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.next(); // Let the user proceed without redirecting
  }

  // Redirect authenticated users away from public routes
  if (
    token &&
    (url.pathname.startsWith('/SignUp') ||
      url.pathname.startsWith('/ManufacturerSignup') ||
      url.pathname.startsWith('/verify')||
      url.pathname==='/'
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  // if (token && url.pathname === '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
  // Redirect unauthenticated users trying to access protected routes
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/SignUp', request.url));
  }

  // Allow access by default for other cases
  return NextResponse.next();
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in',
    '/ManufacturerSignup',
    '/',
     '/dashboard/:path*',
    '/verify/:path*'
  ]

}