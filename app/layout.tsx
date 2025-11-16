import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Haber Nexus - Güncel Haberler",
  description:
    "Türkiye ve dünyadan son dakika haberleri, gündem, ekonomi, spor ve teknoloji haberleri",
}

/**
 * Force dynamic rendering
 *
 * Bu ayar sayesinde kategoriler her istekte veritabanından çekilir.
 * Admin panelden kategori eklendiğinde anında görünür.
 */
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
