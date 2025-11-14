import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileCheck, MessageSquare, Calendar, BarChart3 } from "lucide-react"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  const userRole = session.user?.role
  if (!["EDITOR", "ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
    redirect("/")
  }

  const navItems = [
    { href: "/editor", label: "Dashboard", icon: Home },
    { href: "/editor/review", label: "Onay Bekleyenler", icon: FileCheck },
    { href: "/editor/moderation", label: "Yorum Moderasyonu", icon: MessageSquare },
    { href: "/editor/calendar", label: "İçerik Takvimi", icon: Calendar },
    { href: "/editor/reports", label: "Raporlar", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-xl">
                HaberNexus
              </Link>
              <nav className="hidden md:flex items-center gap-1">
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
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Ana Sayfa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
