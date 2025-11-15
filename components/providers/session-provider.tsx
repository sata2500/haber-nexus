"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useSessionRefresh } from "@/hooks/use-session-refresh"

function SessionRefreshWrapper({ children }: { children: React.ReactNode }) {
  // Session'ı her 5 saniyede bir yenile
  // Bu sayede rol değişiklikleri maksimum 5 saniye içinde kullanıcıya yansır
  useSessionRefresh(5000)
  
  return <>{children}</>
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Session'ı her 5 saniyede bir otomatik yenile
      // Rol değişiklikleri maksimum 5 saniye içinde yansır
      refetchInterval={5}
      // Pencere focus olduğunda session'ı yenile
      refetchOnWindowFocus={true}
    >
      <SessionRefreshWrapper>
        {children}
      </SessionRefreshWrapper>
    </NextAuthSessionProvider>
  )
}
