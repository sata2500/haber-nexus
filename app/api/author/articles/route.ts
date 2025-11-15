import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAuthor, isAdminOrEditor } from "@/lib/permissions"
import { ArticleStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (!isAuthor(userRole) && !isAdminOrEditor(userRole)) {
      return NextResponse.json(
        { error: "Bu sayfaya erişim yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    interface WhereClause {
      authorId: string
      status?: ArticleStatus
    }

    const where: WhereClause = {
      authorId: session.user.id
    }

    if (status) {
      where.status = status as ArticleStatus
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        status: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        publishedAt: true,
        category: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json({ articles })
  } catch (error: unknown) {
    console.error("Error fetching author articles:", error)
    return NextResponse.json(
      { error: "Makaleler yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
