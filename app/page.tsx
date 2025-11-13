import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { prisma } from "@/lib/prisma"
import { Search, TrendingUp, Sparkles, Clock, Zap } from "lucide-react"

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
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-28">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-in fade-in slide-in-from-top duration-500">
                <Sparkles className="h-4 w-4" />
                <span>Yapay Zeka Destekli Haber Platformu</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom duration-700">
                Güncel Haberler ve{" "}
                <span className="gradient-text">Analizler</span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                Türkiye ve dünyadan son dakika haberleri, derinlemesine analizler ve uzman görüşleri
              </p>
              
              {/* Search Bar */}
              <div className="mt-10 flex justify-center animate-in fade-in scale-in duration-700 delay-200">
                <div className="relative w-full max-w-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Haber ara..."
                    className="block w-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm py-4 pl-14 pr-4 text-foreground shadow-lg ring-1 ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="h-5 w-5 text-primary" />
                  <span><strong className="text-foreground">1000+</strong> Haber</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span><strong className="text-foreground">7/24</strong> Güncel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span><strong className="text-foreground">AI</strong> Destekli</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Öne Çıkan Haber</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <PostCard post={featuredPost} />
              <div className="hidden lg:block space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">En Çok Okunanlar</h3>
                  <p className="text-sm text-muted-foreground">Yakında...</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16 bg-muted/30">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Son Haberler</h2>
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Tümünü Gör →
            </button>
          </div>
          
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border border-border bg-card">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">Henüz haber yok</p>
              <p className="text-sm text-muted-foreground">Yakında yeni haberler eklenecek.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
