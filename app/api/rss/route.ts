import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, isActive } = body

    // Check if URL already exists
    const existingFeed = await prisma.rssFeed.findUnique({
      where: { url },
    })

    if (existingFeed) {
      return NextResponse.json({ error: "Bu RSS kaynağı zaten eklenmiş" }, { status: 400 })
    }

    const rssFeed = await prisma.rssFeed.create({
      data: {
        name,
        url,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(rssFeed, { status: 201 })
  } catch (error) {
    console.error("Error creating RSS feed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rssFeeds = await prisma.rssFeed.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(rssFeeds)
  } catch (error) {
    console.error("Error fetching RSS feeds:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
