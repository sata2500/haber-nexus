import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all" // all, articles, categories, tags
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!query || query.length < 2) {
      return NextResponse.json({
        articles: [],
        categories: [],
        tags: [],
      })
    }

    const searchQuery = query.toLowerCase()

    let articles: unknown[] = []
    let categories: unknown[] = []
    let tags: unknown[] = []

    // Makale araması
    if (type === "all" || type === "articles") {
      articles = await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            {
              title: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              excerpt: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        take: limit,
        orderBy: {
          publishedAt: "desc",
        },
      })
    }

    // Kategori araması
    if (type === "all" || type === "categories") {
      categories = await prisma.category.findMany({
        where: {
          isActive: true,
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
        take: limit,
      })
    }

    // Tag araması
    if (type === "all" || type === "tags") {
      tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        take: limit,
        orderBy: {
          useCount: "desc",
        },
      })
    }

    return NextResponse.json({
      query,
      articles,
      categories,
      tags,
      total: articles.length + categories.length + tags.length,
    })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json(
      { error: "Arama sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
