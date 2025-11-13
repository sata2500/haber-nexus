import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HaberNexus - Türkiye ve Dünyadan Haberler",
  description: "Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve derinlemesine analizler.",
  keywords: "haber, gündem, son dakika, türkiye haberleri, dünya haberleri",
  authors: [{ name: "Salih TANRISEVEN" }],
  creator: "Salih TANRISEVEN",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://habernexus.com",
    title: "HaberNexus - Türkiye ve Dünyadan Haberler",
    description: "Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve derinlemesine analizler.",
    siteName: "HaberNexus",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaberNexus - Türkiye ve Dünyadan Haberler",
    description: "Türkiye ve dünyadan son dakika haberleri, güncel gelişmeler ve derinlemesine analizler.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
