import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/users/[id]/settings
 * Kullanıcının ayarlarını getirir
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu ayarları görme yetkiniz yok" },
        { status: 403 }
      )
    }

    // Ayarları getir veya varsayılan değerlerle oluştur
    let settings = await prisma.userSettings.findUnique({
      where: { userId: id },
    })

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: id,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      { error: "Ayarlar alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/[id]/settings
 * Kullanıcının ayarlarını günceller
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user) {
      return NextResponse.json(
        { error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    if (session.user.id !== id) {
      return NextResponse.json(
        { error: "Bu ayarları güncelleme yetkiniz yok" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      profileVisibility,
      showReadingHistory,
      emailNotifications,
      newArticleNotif,
      commentReplyNotif,
      followedAuthorNotif,
      theme,
      fontSize,
      readingMode,
    } = body

    // Geçerli değerleri kontrol et
    if (profileVisibility && !["public", "private"].includes(profileVisibility)) {
      return NextResponse.json(
        { error: "Geçersiz profil görünürlüğü değeri" },
        { status: 400 }
      )
    }

    if (theme && !["light", "dark", "system"].includes(theme)) {
      return NextResponse.json(
        { error: "Geçersiz tema değeri" },
        { status: 400 }
      )
    }

    if (fontSize && !["small", "medium", "large"].includes(fontSize)) {
      return NextResponse.json(
        { error: "Geçersiz font boyutu değeri" },
        { status: 400 }
      )
    }

    if (readingMode && !["default", "focus"].includes(readingMode)) {
      return NextResponse.json(
        { error: "Geçersiz okuma modu değeri" },
        { status: 400 }
      )
    }

    // Ayarları güncelle veya oluştur
    const settings = await prisma.userSettings.upsert({
      where: { userId: id },
      update: {
        ...(profileVisibility !== undefined && { profileVisibility }),
        ...(showReadingHistory !== undefined && { showReadingHistory }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(newArticleNotif !== undefined && { newArticleNotif }),
        ...(commentReplyNotif !== undefined && { commentReplyNotif }),
        ...(followedAuthorNotif !== undefined && { followedAuthorNotif }),
        ...(theme !== undefined && { theme }),
        ...(fontSize !== undefined && { fontSize }),
        ...(readingMode !== undefined && { readingMode }),
      },
      create: {
        userId: id,
        ...(profileVisibility && { profileVisibility }),
        ...(showReadingHistory !== undefined && { showReadingHistory }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(newArticleNotif !== undefined && { newArticleNotif }),
        ...(commentReplyNotif !== undefined && { commentReplyNotif }),
        ...(followedAuthorNotif !== undefined && { followedAuthorNotif }),
        ...(theme && { theme }),
        ...(fontSize && { fontSize }),
        ...(readingMode && { readingMode }),
      },
    })

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error("Error updating user settings:", error)
    return NextResponse.json(
      { error: "Ayarlar güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
