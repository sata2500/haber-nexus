"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Session'ı sadece pencere focus olduğunda yenile
      // Otomatik yenileme KAPALI - Kullanıcı deneyimini bozmamak için
      refetchInterval={0}
      // Pencere focus olduğunda session'ı yenile
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  )
}
