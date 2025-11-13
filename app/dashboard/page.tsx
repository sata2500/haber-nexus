import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Users, Eye, TrendingUp, Plus } from "lucide-react"

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
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    ...(isAdmin
      ? [
          {
            name: "Toplam Kullanıcı",
            value: totalUsers,
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
          },
        ]
      : []),
    {
      name: "Toplam Görüntülenme",
      value: totalViews._sum.viewCount || 0,
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      name: "Ortalama Görüntülenme",
      value: totalPosts > 0 ? Math.round((totalViews._sum.viewCount || 0) / totalPosts) : 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Hoş geldiniz, {session.user.name}
            </p>
          </div>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Yeni İçerik
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`rounded-md p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Link
            href="/dashboard/posts"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
          >
            <FileText className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">İçerik Yönetimi</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tüm içerikleri görüntüle, düzenle ve yönet
            </p>
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/dashboard/rss"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
              >
                <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RSS Beslemeleri</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  RSS kaynaklarını yönet ve otomatik içerik üret
                </p>
              </Link>

              <Link
                href="/dashboard/users"
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800"
              >
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Kullanıcıları ve rollerini yönet
                </p>
              </Link>
            </>
          )}
        </div>

        {/* Recent Posts */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Son İçerikler</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/dashboard/posts/${post.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        {post.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}>
                          {post.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                        </span>
                        {post.category && <span>{post.category.name}</span>}
                        <span>{post.viewCount} görüntülenme</span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Düzenle
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Henüz içerik oluşturmadınız.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
