import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEditor, isAdminOrEditor } from "@/lib/permissions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const userRole = session.user.role
    if (!isEditor(userRole) && !isAdminOrEditor(userRole)) {
      return NextResponse.json(
        { error: "Bu sayfaya erişim yetkiniz yok" },
        { status: 403 }
      )
    }

    const articles = await prisma.article.findMany({
      where: {
        status: "DRAFT",
        submittedAt: { not: null }
      },
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        submittedAt: true,
        qualityScore: true,
        aiGenerated: true,
        author: {
          select: {
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json({ articles })
  } catch (error: unknown) {
    console.error("Error fetching pending articles:", error)
    return NextResponse.json(
      { error: "Makaleler yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
