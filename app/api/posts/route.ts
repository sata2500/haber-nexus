import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "REPORTER")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, coverImage, categoryId, status, type } = body

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const post = await prisma.post.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        categoryId: categoryId || null,
        status,
        type,
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const posts = await prisma.post.findMany({
      where: status ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {},
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
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
