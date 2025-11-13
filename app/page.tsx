import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { prisma } from "@/lib/prisma"
import { Search, TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getLatestPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 12,
    })
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

async function getFeaturedPost() {
  try {
    const post = await prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        viewCount: "desc",
      },
    })
    return post
  } catch (error) {
    console.error("Error fetching featured post:", error)
    return null
  }
}

export default async function Home() {
  const [latestPosts, featuredPost] = await Promise.all([
    getLatestPosts(),
    getFeaturedPost(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Güncel Haberler ve Analizler
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Türkiye ve dünyadan son dakika haberleri, derinlemesine analizler ve uzman görüşleri
              </p>
              
              {/* Search Bar */}
              <div className="mt-10 flex justify-center">
                <div className="relative w-full max-w-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Haber ara..."
                    className="block w-full rounded-full border-0 py-4 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
            <div className="flex items-center gap-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Öne Çıkan Haber</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <PostCard post={featuredPost} />
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Son Haberler</h2>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Henüz yayınlanmış haber bulunmamaktadır.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
