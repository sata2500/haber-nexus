import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Parser from "rss-parser"
import { generateNewsContent, generateNewsTitle, generateExcerpt } from "@/lib/openai"

const parser = new Parser()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { feedId } = body

    if (!feedId) {
      return NextResponse.json({ error: "Feed ID is required" }, { status: 400 })
    }

    const rssFeed = await prisma.rssFeed.findUnique({
      where: { id: feedId },
    })

    if (!rssFeed) {
      return NextResponse.json({ error: "RSS feed not found" }, { status: 404 })
    }

    // Fetch RSS feed
    const feed = await parser.parseURL(rssFeed.url)

    // Process latest items (limit to 5 to avoid rate limits)
    const itemsToProcess = feed.items.slice(0, 5)
    const createdPosts = []

    for (const item of itemsToProcess) {
      if (!item.title) continue

      // Check if post already exists
      const slug = item.title
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const existingPost = await prisma.post.findFirst({
        where: {
          slug: {
            startsWith: slug,
          },
        },
      })

      if (existingPost) continue

      try {
        // Generate AI content
        const enhancedTitle = await generateNewsTitle(item.title)
        const content = await generateNewsContent(
          item.title,
          item.contentSnippet || item.content
        )
        const excerpt = await generateExcerpt(content)

        // Create post
        const post = await prisma.post.create({
          data: {
            title: enhancedTitle,
            slug: `${slug}-${Date.now()}`,
            excerpt,
            content,
            coverImage: item.enclosure?.url || null,
            status: "DRAFT",
            type: "NEWS",
            authorId: session.user.id,
          },
        })

        createdPosts.push(post)
      } catch (error) {
        console.error(`Error processing item "${item.title}":`, error)
        // Continue with next item
      }
    }

    // Update last fetched time
    await prisma.rssFeed.update({
      where: { id: feedId },
      data: { lastFetched: new Date() },
    })

    return NextResponse.json({
      message: `${createdPosts.length} yeni içerik oluşturuldu`,
      posts: createdPosts,
    })
  } catch (error) {
    console.error("Error fetching RSS feed:", error)
    return NextResponse.json(
      { error: "RSS beslemesi çekilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
