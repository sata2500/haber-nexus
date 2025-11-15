import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const userUpdateSchema = z.object({
  name: z.string().min(1, "Ad soyad gerekli").optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
})

/**
 * GET /api/users/me
 * Mevcut kullanıcının bilgilerini döndürür
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
    console.error("Error fetching current user:", error)
    return NextResponse.json(
      { error: "Kullanıcı yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/me
 * Mevcut kullanıcının bilgilerini günceller
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Yetkilendirme gerekli" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = userUpdateSchema.parse(body)

    // Username değişiyorsa benzersizliğini kontrol et
    if (validatedData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: session.user.id },
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
      where: { id: session.user.id },
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

    console.error("Error updating current user:", error)
    return NextResponse.json(
      { error: "Profil güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
