import { NextRequest, NextResponse } from "next/server"
import { parseRssFeed } from "@/lib/rss/parser"

/**
 * Validate RSS feed URL
 * POST /api/rss-feeds/validate
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL gerekli" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ valid: false, error: "Geçersiz URL formatı" }, { status: 400 })
    }

    // Try to parse the RSS feed
    try {
      const feedData = await parseRssFeed(url)

      if (!feedData || !feedData.items || feedData.items.length === 0) {
        return NextResponse.json(
          {
            valid: false,
            error: "RSS feed okunamadı veya içerik bulunamadı",
          },
          { status: 400 }
        )
      }

      return NextResponse.json({
        valid: true,
        feedInfo: {
          title: feedData.title,
          description: feedData.description,
          itemCount: feedData.items.length,
        },
      })
    } catch (error) {
      console.error("RSS feed validation error:", error)
      return NextResponse.json(
        {
          valid: false,
          error:
            error instanceof Error
              ? error.message
              : "RSS feed doğrulanamadı. URL'in doğru olduğundan emin olun.",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Validation request error:", error)
    return NextResponse.json({ error: "İstek işlenirken bir hata oluştu" }, { status: 500 })
  }
}
