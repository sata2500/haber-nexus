import Link from 'next/link'
import Image from 'next/image'
import { Clock, TrendingUp } from 'lucide-react'
import { Article, Media, Category, User } from '@/types'

interface HeroSectionProps {
  featuredArticle: Article | null
  trendingArticles: Article[]
}

export function HeroSection({ featuredArticle, trendingArticles }: HeroSectionProps) {
  // Eğer featured article yoksa, placeholder göster
  if (!featuredArticle) {
    return (
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz öne çıkan haber bulunmuyor.</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredImage = typeof featuredArticle.featuredImage === 'object' 
    ? featuredArticle.featuredImage as Media 
    : null
  const category = typeof featuredArticle.category === 'object'
    ? featuredArticle.category as Category
    : null
  const author = typeof featuredArticle.author === 'object'
    ? featuredArticle.author as User
    : null

  const publishedDate = featuredArticle.publishedAt 
    ? new Date(featuredArticle.publishedAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  return (
    <section className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured News */}
          <div className="lg:col-span-2">
            <Link
              href={`/haber/${featuredArticle.slug}`}
              className="group block relative overflow-hidden rounded-xl bg-muted aspect-[16/9] lg:aspect-[21/9]"
            >
              {/* Featured Image */}
              {featuredImage?.url ? (
                <Image
                  src={featuredImage.url}
                  alt={featuredImage.alt || featuredArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  {category && (
                    <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-medium">
                      {category.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-sm text-white/80">
                    <Clock className="h-4 w-4" />
                    {featuredArticle.views} görüntülenme
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-white/80 text-sm lg:text-base mb-3 line-clamp-2">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  {author && <span>{author.name || author.email}</span>}
                  {author && <span>•</span>}
                  <span>{publishedDate}</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Trending News */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-bold text-foreground">
                Trend Haberler
              </h3>
            </div>
            {trendingArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz trend haber bulunmuyor.</p>
            ) : (
              trendingArticles.map((article, index) => {
                const articleCategory = typeof article.category === 'object'
                  ? article.category as Category
                  : null
                
                const articleDate = article.publishedAt 
                  ? new Date(article.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : ''

                return (
                  <Link
                    key={article.id}
                    href={`/haber/${article.slug}`}
                    className="group block p-4 rounded-lg bg-card hover:bg-accent transition-colors border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        {articleCategory && (
                          <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium mb-2">
                            {articleCategory.name}
                          </span>
                        )}
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {articleDate}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
