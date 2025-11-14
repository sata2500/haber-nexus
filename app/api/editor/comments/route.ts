import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEditor, isAdminOrEditor } from "@/lib/permissions"

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
    if (!isEditor(userRole) && !isAdminOrEditor(userRole)) {
      return NextResponse.json(
        { error: "Bu sayfaya erişim yetkiniz yok" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "PENDING"

    type CommentStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED"

    const comments = await prisma.comment.findMany({
      where: {
        status: status as CommentStatus
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        status: true,
        flagCount: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        article: {
          select: {
            title: true,
          }
        }
      }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Yorumlar yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
