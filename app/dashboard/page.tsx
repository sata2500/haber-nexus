import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Users, Eye, TrendingUp, Plus, ArrowUpRight, Sparkles } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "REPORTER")) {
    redirect("/")
  }

  const isAdmin = session.user.role === "ADMIN"

  // Get statistics
  const [totalPosts, totalUsers, totalViews, userPosts] = await Promise.all([
    isAdmin ? prisma.post.count() : prisma.post.count({ where: { authorId: session.user.id } }),
    isAdmin ? prisma.user.count() : Promise.resolve(0),
    isAdmin
      ? prisma.post.aggregate({ _sum: { viewCount: true } })
      : prisma.post.aggregate({ where: { authorId: session.user.id }, _sum: { viewCount: true } }),
    prisma.post.findMany({
      where: isAdmin ? {} : { authorId: session.user.id },
      include: {
        category: true,
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),
  ])

  const stats = [
    {
      name: "Toplam İçerik",
      value: totalPosts,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
    },
    ...(isAdmin
      ? [
          {
            name: "Toplam Kullanıcı",
            value: totalUsers,
            icon: Users,
            gradient: "from-green-500 to-green-600",
            bgGradient: "from-green-500/10 to-green-600/10",
          },
        ]
      : []),
    {
      name: "Toplam Görüntülenme",
      value: totalViews._sum.viewCount || 0,
      icon: Eye,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
    },
    {
      name: "Ortalama Görüntülenme",
      value: totalPosts > 0 ? Math.round((totalViews._sum.viewCount || 0) / totalPosts) : 0,
      icon: TrendingUp,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hoş geldiniz, <span className="font-semibold text-foreground">{session.user.name}</span>
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Yeni İçerik
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link
          href="/dashboard/posts"
          className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 inline-flex mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              İçerik Yönetimi
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </h3>
            <p className="text-sm text-muted-foreground">
              Tüm içerikleri görüntüle, düzenle ve yönet
            </p>
          </div>
        </Link>

        {isAdmin && (
          <>
            <Link
              href="/dashboard/rss"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 inline-flex mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  RSS Beslemeleri
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  RSS kaynaklarını yönet ve otomatik içerik üret
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/users"
              className="group relative overflow-hidden rounded-2xl glass-card p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 inline-flex mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  Kullanıcı Yönetimi
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Kullanıcıları ve rollerini yönet
                </p>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Recent Posts */}
      <div className="rounded-2xl glass-card overflow-hidden">
        <div className="border-b border-border/50 px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Son İçerikler
          </h2>
        </div>
        <div className="divide-y divide-border/50">
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="px-6 py-4 hover:bg-accent/30 transition-colors duration-200 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                        post.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      }`}>
                        {post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                      </span>
                      {post.category && (
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {post.category.name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.viewCount}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/posts/${post.id}`}
                    className="btn-ghost whitespace-nowrap"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Henüz içerik yok</p>
              <p className="text-sm text-muted-foreground">İlk içeriğinizi oluşturmak için yukarıdaki butonu kullanın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
