import { type NextRequest, NextResponse } from 'next/server'
// import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  // const sessionCookie = getSessionCookie(request)
  // console.log(request.cookies.get("JSESSIONID"), request.url);

  //   if (!sessionCookie) {
  //     return NextResponse.redirect(new URL('/', request.url))
  //   }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
