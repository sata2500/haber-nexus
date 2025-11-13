import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { Article, Media, Category } from '@/types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

const ITEMS_PER_PAGE = 12

export async function generateStaticParams() {
  const payload = await getPayload()
  
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  return categories.docs.map((category: any) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload()
  
  const result = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug }
    },
    limit: 1,
  })

  const category = result.docs[0] as Category | undefined

  if (!category) {
    return {
      title: 'Kategori Bulunamadı',
    }
  }

  return {
    title: `${category.name} Haberleri | HaberNexus`,
    description: category.description || `${category.name} kategorisindeki en son haberler`,
  }
}

export default async function KategoriSayfasi({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Number(pageParam) || 1
  
  const payload = await getPayload()
  
  // Kategoriyi getir
  const categoryResult = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: slug }
    },
    limit: 1,
  })

  const category = categoryResult.docs[0] as Category | undefined

  if (!category) {
    notFound()
  }

  // Kategoriye ait haberleri getir
  const articlesResult = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { status: { equals: 'published' } },
        { category: { equals: category.id } }
      ]
    },
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    sort: '-publishedAt',
  })

  const articles = articlesResult.docs as Article[]
  const totalPages = articlesResult.totalPages
  const hasNextPage = articlesResult.hasNextPage
  const hasPrevPage = articlesResult.hasPrevPage

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {articlesResult.totalDocs} haber bulundu
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Bu kategoride henüz haber bulunmuyor.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article) => {
                const featuredImage = typeof article.featuredImage === 'object' 
                  ? article.featuredImage as Media 
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
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                  >
                    {featuredImage?.url && (
                      <div className="relative w-full aspect-video bg-muted">
                        <Image
                          src={featuredImage.url}
                          alt={featuredImage.alt || article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <time dateTime={article.publishedAt}>{publishedDate}</time>
                        <span>•</span>
                        <span>{article.views} görüntülenme</span>
                      </div>
                      <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {hasPrevPage && (
                  <Link
                    href={`/kategori/${slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-card border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    Önceki
                  </Link>
                )}
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Sadece mevcut sayfanın etrafındaki sayfaları göster
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <Link
                          key={pageNum}
                          href={`/kategori/${slug}?page=${pageNum}`}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border border-border hover:bg-muted'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      )
                    } else if (
                      pageNum === currentPage - 3 ||
                      pageNum === currentPage + 3
                    ) {
                      return <span key={pageNum} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>

                {hasNextPage && (
                  <Link
                    href={`/kategori/${slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-card border border-border rounded-md hover:bg-muted transition-colors"
                  >
                    Sonraki
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
