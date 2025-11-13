"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Gündem", href: "/kategori/gundem" },
    { name: "Teknoloji", href: "/kategori/teknoloji" },
    { name: "Ekonomi", href: "/kategori/ekonomi" },
    { name: "Spor", href: "/kategori/spor" },
    { name: "Dünya", href: "/kategori/dunya" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group">
            <span className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200 inline-block">
              Haber Nexus
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-foreground hover:bg-accent transition-colors"
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

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
          <ThemeToggle />
          
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-all duration-200"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span className="hidden xl:inline">{session.user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                    
                    {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        signOut()
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="btn-primary inline-flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Giriş Yap
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-border pt-4 pb-3">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  
                  {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("google")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <User className="h-5 w-5" />
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
