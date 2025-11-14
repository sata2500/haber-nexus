"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { useSessionRefresh } from "@/hooks/use-session-refresh"

function SessionRefreshWrapper({ children }: { children: React.ReactNode }) {
  // Session'ı her 30 saniyede bir yenile
  // Bu sayede rol değişiklikleri maksimum 30 saniye içinde kullanıcıya yansır
  useSessionRefresh(30000)
  
  return <>{children}</>
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Session'ı sayfa değişikliklerinde otomatik yenile
      refetchInterval={30}
      // Pencere focus olduğunda session'ı yenile
      refetchOnWindowFocus={true}
    >
      <SessionRefreshWrapper>
        {children}
      </SessionRefreshWrapper>
    </NextAuthSessionProvider>
  )
}
