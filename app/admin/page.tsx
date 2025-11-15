import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  // Get statistics
  const [
    totalUsers,
    totalArticles,
    totalCategories,
    totalComments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.article.count(),
    prisma.category.count(),
    prisma.comment.count()
  ])
  
  const stats = [
    {
      title: "Toplam Kullanıcılar",
      value: totalUsers,
      description: "Kayıtlı kullanıcı sayısı"
    },
    {
      title: "Toplam Makaleler",
      value: totalArticles,
      description: "Yayınlanan ve taslak makaleler"
    },
    {
      title: "Kategoriler",
      value: totalCategories,
      description: "Aktif kategori sayısı"
    },
    {
      title: "Yorumlar",
      value: totalComments,
      description: "Toplam yorum sayısı"
    }
  ]
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Hoş geldiniz, {session.user?.name}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="h-4 w-4 mr-2" />
            Ana Sayfa
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/content-creator"
              className="p-4 border rounded-lg hover:bg-accent transition-colors bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h3 className="font-semibold">AI İçerik Oluşturucu</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Yapay zeka ile özgün içerik oluştur
              </p>
            </Link>
            <Link
              href="/admin/drafts"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📝</span>
                <h3 className="font-semibold">İçerik Taslakları</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Taslakları görüntüle ve yönet
              </p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">Kullanıcı Yönetimi</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Kullanıcıları görüntüle ve yönet
              </p>
            </Link>
            <Link
              href="/admin/articles"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">Makale Yönetimi</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Makaleleri görüntüle ve düzenle
              </p>
            </Link>
            <Link
              href="/admin/categories"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">Kategori Yönetimi</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Kategorileri düzenle
              </p>
            </Link>
            <Link
              href="/admin/rss-feeds"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">RSS Feed Yönetimi</h3>
              <p className="text-sm text-muted-foreground mt-1">
                RSS kaynaklarını yönet
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
