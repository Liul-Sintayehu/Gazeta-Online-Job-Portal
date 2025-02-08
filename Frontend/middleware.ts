// import NextAuth from 'next-auth';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { AuthConfig } from './app/_services/authService';
// import { auth } from './auth';

// export async function middleware(request: NextRequest) {
//   const session = await auth();

//   if (request.nextUrl.pathname === '/auth/login') {
//     return NextResponse.next(); // Allow the request to continue to the login page
//   }

//   // If the user is not authenticated and tries to access protected routes, redirect to login
//   if (!session) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }

//   // Session expiry logic: Check if the session has expired
//   const sessionExpiry = new Date(session.user.expiry as string);
//   const currentTime = new Date();

//   // If the session has expired, redirect to login page
//   if (sessionExpiry < currentTime) {
//     return NextResponse.redirect(new URL('/auth/login', request.url));
//   }
//   const authResult = NextAuth(AuthConfig).auth;
//   if (authResult instanceof Response) return authResult;

//   const response = NextResponse.next();

//   response.headers.set('X-Frame-Options', 'DENY');

//   return response;
// }

// export const config = {
//   matcher: ['/((?!auth/login|api|_next/static|_next/image|.*\\.png$).*)'],
// };
export async function middleware() {

}