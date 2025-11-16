import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookmarksClient } from "./bookmarks-client"
import {} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bookmark } from "lucide-react"
import Link from "next/link"

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const bookmarksData = await prisma.bookmark.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      article: {
        include: {
          category: {
            select: {
              name: true,
            },
          },
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Date tiplerini string'e çevir
  const bookmarks = bookmarksData.map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
    article: {
      ...bookmark.article,
      publishedAt: bookmark.article.publishedAt?.toISOString() || null,
    },
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Button>
            </Link>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold">
                <Bookmark className="h-8 w-8" />
                Kaydedilenler
              </h1>
              <p className="text-muted-foreground mt-1">Kaydettiğiniz makaleleri görüntüleyin</p>
            </div>
          </div>

          <BookmarksClient initialBookmarks={bookmarks} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
