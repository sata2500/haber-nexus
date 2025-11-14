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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Haber Nexus
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Haber ara..."
                className="pl-8 w-[200px] lg:w-[300px]"
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
                    <p className="text-sm font-medium leading-none">
                      {session.user.name || "İsimsiz"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                    {session.user.role && (
                      <Badge 
                        variant={ROLE_COLORS[session.user.role as UserRole] as any}
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
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
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
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/auth/signin")}
            >
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
