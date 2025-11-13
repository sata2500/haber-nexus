"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Gündem", href: "/kategori/gundem" },
    { name: "Teknoloji", href: "/kategori/teknoloji" },
    { name: "Ekonomi", href: "/kategori/ekonomi" },
    { name: "Spor", href: "/kategori/spor" },
    { name: "Dünya", href: "/kategori/dunya" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Haber Nexus
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menüyü aç</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-x-4">
              {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-x-1.5 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-x-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Çıkış
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
            >
              <User className="h-4 w-4" />
              Giriş Yap
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4 pb-3 px-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
              <ThemeToggle />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              {session ? (
                <div className="space-y-2">
                  {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("google")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
