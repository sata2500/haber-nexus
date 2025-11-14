import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN"
    const isEditor = token?.role === "EDITOR"
    const isAuthor = token?.role === "AUTHOR"
    
    // Admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin && !isEditor) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
    
    // Author routes
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!isAuthor && !isEditor && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"]
}
