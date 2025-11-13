import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Home, FileText, Rss, Users, Settings, ArrowLeft } from "lucide-react"
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
      : []),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Haber Nexus
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <Link
              href="/"
              className="group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5 flex-shrink-0" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {session.user.role === "ADMIN" ? "Yönetici Paneli" : "Muhabir Paneli"}
          </h2>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
