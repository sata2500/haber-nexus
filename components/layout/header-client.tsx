"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Search, Menu, User, LogOut, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAccessibleDashboards } from "@/lib/dashboard-utils"
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

/**
 * Client-side Header Bileşeni
 *
 * Kullanıcı etkileşimlerini (arama, menü, oturum) yönetir.
 * Kategoriler parent component'ten prop olarak alınır.
 * Rol bazlı dashboard navigasyonu sağlar.
 */

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
}

interface HeaderClientProps {
  categories: Category[]
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Kullanıcının erişebileceği dashboard'ları al
  const accessibleDashboards = session?.user?.role
    ? getAccessibleDashboards(session.user.role as UserRole)
    : []

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      {/* Top Bar */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Haber Nexus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden items-center space-x-2 lg:flex">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Haber ara..."
                className="w-[200px] pl-8 lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => router.push("/search")}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Ara</span>
          </Button>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {session.user.image ? (
                    <div className="relative h-8 w-8">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ""}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm leading-none font-medium">
                      {session.user.name || "İsimsiz"}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {session.user.email}
                    </p>
                    {session.user.role && (
                      <Badge
                        variant={ROLE_COLORS[session.user.role as UserRole]}
                        className="w-fit text-xs"
                      >
                        {ROLE_LABELS[session.user.role as UserRole]}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>

                {/* Dashboard Links */}
                {accessibleDashboards.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
                      Dashboard Erişimi
                    </DropdownMenuLabel>
                    {accessibleDashboards.map((dashboard) => {
                      const Icon = dashboard.icon
                      return (
                        <DropdownMenuItem
                          key={dashboard.id}
                          onClick={() => router.push(dashboard.href)}
                        >
                          <Icon className={`mr-2 h-4 w-4 ${dashboard.color}`} />
                          <span>{dashboard.label}</span>
                        </DropdownMenuItem>
                      )
                    })}
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profilim</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile#settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ayarlar</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/auth/signin")}>
              Giriş Yap
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menü</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
