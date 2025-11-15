"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Bildirim Bazlı Session Yenileme Hook'u
 * 
 * Bu hook, kullanıcıya rol değişikliği bildirimi geldiğinde
 * otomatik olarak session'ı yeniler ve sayfayı refresh eder.
 * 
 * Bu sayede kullanıcı rol değişikliğini anında görebilir ve
 * yeni yetkilerine hemen erişebilir.
 * 
 * @param notifications - Kullanıcının bildirimleri
 */
interface Notification {
  type: string
  isRead: boolean
  [key: string]: unknown
}

export function useNotificationSessionRefresh(notifications: Notification[] = []) {
  const { update } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Son bildirimi kontrol et
    if (notifications.length === 0) return

    const latestNotification = notifications[0]

    // Eğer okunmamış bir rol değişikliği bildirimi varsa
    if (
      latestNotification.type === "ROLE_CHANGE" &&
      !latestNotification.isRead
    ) {
      // Session'ı hemen güncelle
      const refreshSession = async () => {
        try {
          console.log("[Notification Session Refresh] Rol değişikliği bildirimi alındı, session güncelleniyor...")
          
          // Session'ı güncelle
          await update()
          
          // Sayfayı yenile (server component'leri güncellemek için)
          router.refresh()
          
          console.log("[Notification Session Refresh] Session başarıyla güncellendi")
        } catch (error) {
          console.error("[Notification Session Refresh] Session güncelleme hatası:", error)
        }
      }

      refreshSession()
    }
  }, [notifications, update, router])
}

/**
 * Manuel Bildirim Session Refresh
 * 
 * Kullanıcı bir bildirimi okuduğunda manuel olarak session'ı yenilemek için kullanılır.
 */
export function useManualNotificationRefresh() {
  const { update } = useSession()
  const router = useRouter()

  const refreshOnNotificationRead = async (notificationType: string) => {
    if (notificationType === "ROLE_CHANGE") {
      try {
        await update()
        router.refresh()
        return { success: true }
      } catch (error) {
        console.error("Notification refresh error:", error)
        return { success: false, error }
      }
    }
    return { success: true }
  }

  return { refreshOnNotificationRead }
}
