import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isEditor, isAdminOrEditor } from "@/lib/permissions"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!["APPROVED", "REJECTED", "FLAGGED"].includes(status)) {
      return NextResponse.json(
        { error: "Geçersiz durum" },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ comment })
  } catch (error: unknown) {
    console.error("Error moderating comment:", error)
    return NextResponse.json(
      { error: "Yorum güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
