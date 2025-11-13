import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { Home, FileText, Rss, Users, Settings, ArrowLeft, Bell, User } from "lucide-react"
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
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-72 overflow-y-auto border-r border-border bg-card lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/" className="flex items-center gap-x-2 group">
              <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
                Haber Nexus
              </span>
            </Link>
          </div>

          {/* User Info */}
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full ring-2 ring-primary/20"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.user.role === "ADMIN" ? "Yönetici" : "Muhabir"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Back to Home */}
          <div className="border-t border-border p-4">
            <Link
              href="/"
              className="group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform duration-200" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {session.user.role === "ADMIN" ? "Yönetici Paneli" : "Muhabir Paneli"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Hoş geldiniz, {session.user.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error"></span>
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
