import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN"
    const isEditor = token?.role === "EDITOR"
    const isAuthor = token?.role === "AUTHOR"

    // Admin routes - sadece admin ve editörler erişebilir
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin && !isEditor) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Author routes - yazar, editör ve adminler erişebilir
    if (req.nextUrl.pathname.startsWith("/author")) {
      if (!isAuthor && !isEditor && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Editor routes - sadece editör ve adminler erişebilir
    if (req.nextUrl.pathname.startsWith("/editor")) {
      if (!isEditor && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Dashboard routes (eski)
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!isAuthor && !isEditor && !isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/author/:path*", "/editor/:path*", "/dashboard/:path*"],
}
