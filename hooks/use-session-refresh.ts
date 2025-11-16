"use client"

import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"

/**
 * Session Yenileme Hook'u
 *
 * Bu hook, kullanıcının session'ını belirli aralıklarla otomatik olarak yeniler.
 * Rol değişiklikleri gibi veritabanı güncellemelerinin session'a yansıması için kullanılır.
 *
 * @param intervalMs - Yenileme aralığı (milisaniye, varsayılan: 60000 = 1 dakika)
 */
export function useSessionRefresh(intervalMs: number = 60000) {
  const { data: session, update } = useSession()
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Sadece giriş yapmış kullanıcılar için çalışsın
    if (!session) return

    // Session'ı periyodik olarak yenile
    intervalRef.current = setInterval(async () => {
      try {
        await update()
      } catch (error) {
        console.error("Session refresh error:", error)
      }
    }, intervalMs)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [session, update, intervalMs])
}

/**
 * Manuel Session Yenileme Hook'u
 *
 * Bu hook, session'ı manuel olarak yenilemek için bir fonksiyon döndürür.
 * Örneğin, kullanıcı profilini güncelledikten sonra kullanılabilir.
 */
export function useManualSessionRefresh() {
  const { update } = useSession()

  const refreshSession = async () => {
    try {
      await update()
      return { success: true }
    } catch (error) {
      console.error("Manual session refresh error:", error)
      return { success: false, error }
    }
  }

  return { refreshSession }
}
