import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
  newPassword: z.string().min(6, "Yeni şifre en az 6 karakter olmalıdır"),
})

/**
 * PATCH /api/users/me/password
 * Mevcut kullanıcının şifresini değiştirir
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkilendirme gerekli" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = passwordChangeSchema.parse(body)

    // Kullanıcıyı ve mevcut şifresini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı veya şifre yok" }, { status: 404 })
    }

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Mevcut şifre yanlış" }, { status: 400 })
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Şifreyi güncelle
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Şifre başarıyla değiştirildi",
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.issues }, { status: 400 })
    }

    console.error("Error changing password:", error)
    return NextResponse.json({ error: "Şifre değiştirilirken bir hata oluştu" }, { status: 500 })
  }
}
