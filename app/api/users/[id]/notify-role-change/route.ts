import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Kullanıcı Rol Değişikliği Bildirimi
 * 
 * Bu endpoint, bir kullanıcının rolü değiştirildiğinde
 * o kullanıcıya bir bildirim gönderir.
 * 
 * Admin kullanıcı rolünü değiştirdiğinde bu endpoint çağrılır
 * ve etkilenen kullanıcı bir bildirim alır.
 */
export async function POST(
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

    // Sadece admin rol değişikliği bildirebilir
    const userRole = session.user?.role
    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { oldRole, newRole } = body

    // Kullanıcıya bildirim oluştur
    await prisma.notification.create({
      data: {
        userId: id,
        type: "ROLE_CHANGE",
        title: "Rol Değişikliği",
        message: `Rolünüz "${oldRole}" iken "${newRole}" olarak değiştirildi. Yeni yetkileriniz için lütfen sayfayı yenileyin veya tekrar giriş yapın.`,
        isRead: false,
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "Bildirim gönderildi" 
    })
  } catch (error) {
    console.error("Error sending role change notification:", error)
    return NextResponse.json(
      { error: "Bildirim gönderilemedi" },
      { status: 500 }
    )
  }
}
