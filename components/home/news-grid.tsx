import Link from 'next/link'
import Image from 'next/image'
import { Clock } from 'lucide-react'
import { Article, Media, Category, User } from '@/types'

interface NewsGridProps {
  title: string
  category?: Category
  articles: Article[]
}

export function NewsGrid({ title, category, articles }: NewsGridProps) {
  if (articles.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            {title}
          </h2>
          {category && (
            <Link
              href={`/kategori/${category.slug}`}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Tümünü Gör →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const featuredImage = typeof article.featuredImage === 'object' 
              ? article.featuredImage as Media 
              : null
            const articleCategory = typeof article.category === 'object'
              ? article.category as Category
              : null
            const author = typeof article.author === 'object'
              ? article.author as User
              : null

            const publishedDate = article.publishedAt 
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
                className="group block rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                  {featuredImage?.url ? (
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.alt || article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {articleCategory && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {articleCategory.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.views} görüntülenme
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {author && <span>{author.name || author.email}</span>}
                    <span>{publishedDate}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
