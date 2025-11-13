"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Gündem", href: "/kategori/gundem" },
    { name: "Teknoloji", href: "/kategori/teknoloji" },
    { name: "Ekonomi", href: "/kategori/ekonomi" },
    { name: "Spor", href: "/kategori/spor" },
    { name: "Dünya", href: "/kategori/dunya" },
  ]

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-lg shadow-primary/5' 
          : 'bg-background/95 backdrop-blur-sm border-b border-border/40'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-primary to-purple-500 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200 inline-block">
                Haber Nexus
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-foreground hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
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
        <div className="hidden lg:flex lg:gap-x-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-all duration-200 rounded-lg hover:bg-accent/50 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-3/4 rounded-full" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 items-center">
          <ThemeToggle />
          
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {session.user.image ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="relative h-8 w-8 rounded-full ring-2 ring-primary/30"
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <span className="hidden xl:inline">{session.user.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl glass-card z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-1.5">
                    <div className="px-4 py-3 mb-1 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{session.user.email}</p>
                    </div>
                    
                    {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-200 rounded-lg"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <div className="p-1.5 rounded-md bg-primary/10">
                          <LayoutDashboard className="h-4 w-4 text-primary" />
                        </div>
                        <span>Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        signOut()
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-all duration-200 rounded-lg mt-1"
                    >
                      <div className="p-1.5 rounded-md bg-error/10">
                        <LogOut className="h-4 w-4 text-error" />
                      </div>
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="btn-primary"
            >
              <User className="h-4 w-4" />
              Giriş Yap
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 glass animate-in slide-in-from-top duration-300">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-4 py-2.5 text-base font-medium text-foreground hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-border/50 pt-4 pb-3 mt-3">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    {session.user.image ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="relative h-10 w-10 rounded-full ring-2 ring-primary/30"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </div>
                  
                  {(session.user.role === "ADMIN" || session.user.role === "REPORTER") && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium text-foreground hover:bg-accent/50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <LayoutDashboard className="h-5 w-5 text-primary" />
                      </div>
                      Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-base font-medium text-error hover:bg-error/10 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-md bg-error/10">
                      <LogOut className="h-5 w-5 text-error" />
                    </div>
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signIn("google")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full btn-primary"
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
