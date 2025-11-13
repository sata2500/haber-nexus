import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { prisma } from "@/lib/prisma"
import { Search, TrendingUp, Sparkles, Clock, Zap, Newspaper, BarChart3 } from "lucide-react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
  viewCount: number
  author: {
    name: string | null
    image: string | null
  }
  category: {
    name: string
    slug: string
  } | null
}

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
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-20 lg:py-32">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-bold text-primary animate-in fade-in slide-in-from-top duration-500 shadow-lg hover:scale-105 transition-transform duration-300">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Yapay Zeka Destekli Haber Platformu</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl animate-in fade-in slide-in-from-bottom duration-700 leading-tight">
                Güncel Haberler ve{" "}
                <span className="gradient-text">Analizler</span>
              </h1>
              
              <p className="mt-8 text-lg sm:text-xl leading-8 text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                Türkiye ve dünyadan son dakika haberleri, derinlemesine analizler ve uzman görüşleri. 
                Her an, her yerde, güvenilir haber kaynağınız.
              </p>
              
              {/* Search Bar */}
              <div className="mt-12 flex justify-center animate-in fade-in scale-in duration-700 delay-200">
                <div className="relative w-full max-w-2xl">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Haber ara..."
                    className="block w-full rounded-2xl border-2 border-border glass py-5 pl-16 pr-6 text-foreground shadow-2xl shadow-primary/10 ring-2 ring-transparent placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300 text-lg hover:shadow-primary/20"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <div className="group flex items-center gap-3 glass px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Newspaper className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">1000+</div>
                    <div className="text-sm text-muted-foreground">Haber</div>
                  </div>
                </div>
                <div className="group flex items-center gap-3 glass px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">7/24</div>
                    <div className="text-sm text-muted-foreground">Güncel</div>
                  </div>
                </div>
                <div className="group flex items-center gap-3 glass px-6 py-4 rounded-2xl hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">AI</div>
                    <div className="text-sm text-muted-foreground">Destekli</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/25">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Öne Çıkan Haber</h2>
                <p className="text-sm text-muted-foreground mt-1">En çok okunan ve trend olan içerik</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PostCard post={featuredPost} />
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">En Çok Okunanlar</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Yakında en popüler haberler burada listelenecek...</p>
                </div>
                <div className="rounded-2xl glass-card p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Editörün Seçtikleri</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Editörlerimizin özenle seçtiği haberler...</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Posts */}
        <section className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent -z-10" />
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Son Haberler</h2>
              <p className="text-sm text-muted-foreground mt-2">En güncel haberler ve gelişmeler</p>
            </div>
            <button className="btn-ghost group">
              <span>Tümünü Gör</span>
              <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
          </div>
          
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post: Post, index: number) => (
                <div 
                  key={post.id} 
                  className="animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 rounded-2xl glass-card">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-6 shadow-xl shadow-primary/25">
                <Search className="h-10 w-10 text-white" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Henüz haber yok</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Yakında yeni haberler eklenecek. Güncel içerikler için bizi takip etmeye devam edin.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
