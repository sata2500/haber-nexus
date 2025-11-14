import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const userUpdateSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["USER", "AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"]).optional(),
})

// GET - Kullanıcı detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true,
            bookmarks: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Kullanıcı yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// PATCH - Kullanıcı güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = userUpdateSchema.parse(body)

    // Yetki kontrolü - sadece admin veya kullanıcının kendisi güncelleyebilir
    const userRole = session.user?.role
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole || "")
    const isSelf = session.user?.id === id

    if (!isAdmin && !isSelf) {
      return NextResponse.json(
        { error: "Bu kullanıcıyı güncelleme yetkiniz yok" },
        { status: 403 }
      )
    }

    // Rol değişikliği sadece admin yapabilir
    if (validatedData.role && !isAdmin) {
      return NextResponse.json(
        { error: "Rol değiştirme yetkiniz yok" },
        { status: 403 }
      )
    }

    // Username değişiyorsa benzersizliğini kontrol et
    if (validatedData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id },
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Bu kullanıcı adı zaten kullanılıyor" },
          { status: 400 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        role: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.issues },
        { status: 400 }
      )
    }

    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Kullanıcı güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// DELETE - Kullanıcı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    // Sadece admin kullanıcı silebilir
    const userRole = session.user?.role
    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Kendi hesabını silemesin
    if (session.user?.id === id) {
      return NextResponse.json(
        { error: "Kendi hesabınızı silemezsiniz" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Kullanıcı silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
