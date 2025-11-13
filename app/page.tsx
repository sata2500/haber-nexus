import { getPayload } from '@/lib/payload'
import { Article, Category } from '@/types'
import { HeroSection } from '@/components/home/hero-section'
import { NewsGrid } from '@/components/home/news-grid'

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function Home() {
  const payload = await getPayload()

  // Featured article için veri çek
  const featuredResult = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { status: { equals: 'published' } },
        { isFeatured: { equals: true } }
      ]
    },
    limit: 1,
    sort: '-publishedAt',
  })

  const featuredArticle = (featuredResult.docs[0] as Article) || null

  // Trending articles (en çok görüntülenen)
  const trendingResult = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' }
    },
    limit: 3,
    sort: '-views',
  })

  const trendingArticles = trendingResult.docs as Article[]

  // Son haberler
  const latestResult = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' }
    },
    limit: 6,
    sort: '-publishedAt',
  })

  const latestArticles = latestResult.docs as Article[]

  // Kategorileri getir
  const categoriesResult = await payload.find({
    collection: 'categories',
    limit: 10,
    sort: 'name',
  })

  const categories = categoriesResult.docs as Category[]

  // Her kategori için haberler
  const categoryArticles: Record<string, Article[]> = {}
  
  for (const category of categories.slice(0, 3)) {
    const result = await payload.find({
      collection: 'articles',
      where: {
        and: [
          { status: { equals: 'published' } },
          { category: { equals: category.id } }
        ]
      },
      limit: 6,
      sort: '-publishedAt',
    })
    categoryArticles[category.id] = result.docs as Article[]
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <HeroSection 
        featuredArticle={featuredArticle}
        trendingArticles={trendingArticles}
      />

      {/* Latest News */}
      <NewsGrid 
        title="Son Haberler" 
        articles={latestArticles}
      />

      {/* Category Sections */}
      {categories.slice(0, 3).map((category, index) => {
        const articles = categoryArticles[category.id] || []
        if (articles.length === 0) return null

        return (
          <div 
            key={category.id}
            className={index % 2 === 0 ? 'bg-background border-y border-border' : ''}
          >
            <NewsGrid 
              title={category.name}
              category={category}
              articles={articles}
            />
          </div>
        )
      })}
    </div>
  )
}
