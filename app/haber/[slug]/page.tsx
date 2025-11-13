import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from '@/lib/payload'
import { Article, Media, Category, User, Tag } from '@/types'
import { serialize } from '@/lib/serialize'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  const articles = await payload.find({
    collection: 'articles',
    where: {
      status: { equals: 'published' }
    },
    limit: 1000,
  })

  return articles.docs.map((article: any) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload()
  
  const result = await payload.find({
    collection: 'articles',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' }
    },
    limit: 1,
  })

  const article = result.docs[0] as Article | undefined

  if (!article) {
    return {
      title: 'Haber Bulunamadı',
    }
  }

  const featuredImage = typeof article.featuredImage === 'object' ? article.featuredImage : null

  return {
    title: `${article.title} | HaberNexus`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: typeof article.author === 'object' ? [article.author.name || article.author.email] : [],
      images: featuredImage?.url ? [
        {
          url: featuredImage.url,
          width: featuredImage.width,
          height: featuredImage.height,
          alt: featuredImage.alt || article.title,
        }
      ] : [],
    },
  }
}

export default async function HaberDetay({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload()
  
  const result = await payload.find({
    collection: 'articles',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' }
    },
    limit: 1,
  })

  const article = result.docs[0] as Article | undefined

  if (!article) {
    notFound()
  }

  // İlgili haberleri getir
  const relatedResult = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { status: { equals: 'published' } },
        { id: { not_equals: article.id } },
        { category: { equals: typeof article.category === 'object' ? article.category.id : article.category } }
      ]
    },
    limit: 3,
    sort: '-publishedAt',
  })

  const relatedArticles = relatedResult.docs as Article[]

  const featuredImage = typeof article.featuredImage === 'object' ? article.featuredImage as Media : null
  const category = typeof article.category === 'object' ? article.category as Category : null
  const author = typeof article.author === 'object' ? article.author as User : null
  const tags = article.tags?.filter((tag): tag is Tag => typeof tag === 'object') || []

  const publishedDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : ''

  return (
    <article className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            {category && (
              <>
                <Link 
                  href={`/kategori/${category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{article.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Category Badge */}
        {category && (
          <Link 
            href={`/kategori/${category.slug}`}
            className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors mb-4"
          >
            {category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
          {author && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{author.name || author.email}</span>
            </div>
          )}
          <span>•</span>
          <time dateTime={article.publishedAt}>{publishedDate}</time>
          <span>•</span>
          <span>{article.views} görüntülenme</span>
        </div>

        {/* Featured Image */}
        {featuredImage?.url && (
          <div className="relative w-full aspect-video mb-8 rounded-lg overflow-hidden bg-muted">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || article.title}
              fill
              className="object-cover"
              priority
            />
            {featuredImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-3">
                {featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {serialize(article.content)}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Etiketler:</span>
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-muted text-foreground text-sm rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-muted/30 border-t border-border py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">İlgili Haberler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => {
                const relatedImage = typeof relatedArticle.featuredImage === 'object' 
                  ? relatedArticle.featuredImage as Media 
                  : null
                const relatedCategory = typeof relatedArticle.category === 'object'
                  ? relatedArticle.category as Category
                  : null

                return (
                  <Link
                    key={relatedArticle.id}
                    href={`/haber/${relatedArticle.slug}`}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                  >
                    {relatedImage?.url && (
                      <div className="relative w-full aspect-video bg-muted">
                        <Image
                          src={relatedImage.url}
                          alt={relatedImage.alt || relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {relatedCategory && (
                        <span className="text-xs font-medium text-primary mb-2 block">
                          {relatedCategory.name}
                        </span>
                      )}
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
