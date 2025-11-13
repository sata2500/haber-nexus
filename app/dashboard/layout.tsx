import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { Home, FileText, Rss, Users, Settings, ArrowLeft, Bell, User, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "REPORTER")) {
    redirect("/")
  }

  const isAdmin = session.user.role === "ADMIN"

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "İçerikler", href: "/dashboard/posts", icon: FileText },
    ...(isAdmin
      ? [
          { name: "RSS Beslemeleri", href: "/dashboard/rss", icon: Rss },
          { name: "Kullanıcılar", href: "/dashboard/users", icon: Users },
          { name: "Ayarlar", href: "/dashboard/settings", icon: Settings },
        ]
      : [{ name: "RSS Beslemeleri", href: "/dashboard/rss", icon: Rss }]),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Sidebar */}
      <aside className="hidden w-72 overflow-y-auto border-r border-border/50 glass lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border/50 px-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-primary to-purple-500 p-1.5 rounded-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                Haber Nexus
              </span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-border/50 p-6">
            <div className="flex items-center gap-3 p-3 rounded-xl glass-card hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {session.user.image ? (
                  <>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={48}
                      height={48}
                      className="relative h-12 w-12 rounded-full ring-2 ring-primary/30"
                    />
                  </>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {session.user.role === "ADMIN" ? "Yönetici" : "Muhabir"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <item.icon className="h-4 w-4" />
                </div>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Back to Home */}
          <div className="border-t border-border/50 p-4">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform duration-200" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/50 glass px-6">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {session.user.role === "ADMIN" ? "Yönetici Paneli" : "Muhabir Paneli"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hoş geldiniz, <span className="font-semibold text-foreground">{session.user.name}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200 hover:scale-110 active:scale-95">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error animate-pulse shadow-lg shadow-error/50"></span>
            </button>
            
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
