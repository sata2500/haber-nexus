import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const articleSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "İçerik gereklidir"),
  coverImage: z.string().optional(),
  type: z.enum(["NEWS", "BLOG", "ANALYSIS", "INTERVIEW", "OPINION"]).optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  categoryId: z.string().min(1, "Kategori gereklidir"),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
})

// GET - Makaleleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const authorId = searchParams.get("authorId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    if (status) {
      where.status = status
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (authorId) {
      where.authorId = authorId
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              bookmarks: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Makaleler yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// POST - Yeni makale oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    // Sadece yazar, editör ve admin makale oluşturabilir
    const userRole = session.user?.role
    if (!["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = articleSchema.parse(body)

    // Slug'ın benzersiz olduğunu kontrol et
    const existingArticle = await prisma.article.findUnique({
      where: { slug: validatedData.slug },
    })

    if (existingArticle) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      )
    }

    // Tag'leri işle (varsa oluştur, yoksa bağla)
    const tagConnections = validatedData.tags
      ? await Promise.all(
          validatedData.tags.map(async (tagName) => {
            const slug = tagName
              .toLowerCase()
              .replace(/ğ/g, "g")
              .replace(/ü/g, "u")
              .replace(/ş/g, "s")
              .replace(/ı/g, "i")
              .replace(/ö/g, "o")
              .replace(/ç/g, "c")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")

            const tag = await prisma.tag.upsert({
              where: { slug },
              update: {
                useCount: { increment: 1 },
              },
              create: {
                name: tagName,
                slug,
                useCount: 1,
              },
            })

            return { id: tag.id }
          })
        )
      : []

    const article = await prisma.article.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        type: validatedData.type || "NEWS",
        status: validatedData.status || "DRAFT",
        categoryId: validatedData.categoryId,
        authorId: session.user?.id || "",
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        keywords: validatedData.keywords || [],
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Makale oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}
