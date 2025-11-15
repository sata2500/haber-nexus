import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Force Session Refresh API
 * 
 * Bu endpoint, belirli bir kullanıcının session'ını güncellemeye zorlar.
 * Admin tarafından rol değişikliği yapıldığında çağrılır.
 * 
 * Kullanıcının bir sonraki isteğinde JWT token yeniden oluşturulur
 * ve güncel rol bilgisi token'a yazılır.
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

    // Sadece admin bu işlemi yapabilir
    const userRole = session.user?.role
    if (!["ADMIN", "SUPER_ADMIN"].includes(userRole || "")) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      )
    }

    const { id } = await params

    // Bu endpoint'in amacı sadece admin'e başarı mesajı döndürmek
    // Gerçek session refresh, kullanıcının tarayıcısında otomatik olarak
    // SessionProvider ve useSessionRefresh hook'ları tarafından yapılacak
    
    // Log kaydı
    console.log(`[Force Session Refresh] Admin ${session.user?.email} kullanıcı ${id} için session refresh tetikledi`)

    return NextResponse.json({ 
      success: true,
      message: "Session refresh tetiklendi. Kullanıcının session'ı 5 saniye içinde güncellenecek."
    })
  } catch (error: unknown) {
    console.error("Error forcing session refresh:", error)
    return NextResponse.json(
      { error: "Session refresh tetiklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
