import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText, FilePlus, BarChart3, User } from "lucide-react"

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const userRole = session.user?.role
  if (!["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
    redirect("/")
  }

  const navItems = [
    { href: "/author", label: "Dashboard", icon: Home },
    { href: "/author/articles", label: "Makalelerim", icon: FileText },
    { href: "/author/drafts", label: "Taslaklar", icon: FilePlus },
    { href: "/author/analytics", label: "İstatistikler", icon: BarChart3 },
    { href: "/author/profile", label: "Profilim", icon: User },
  ]

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold">
                HaberNexus
              </Link>
              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Ana Sayfa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
