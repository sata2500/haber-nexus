import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTags, extractKeywords, generateSeoTitle, generateMetaDescription } from "@/lib/ai/gemini"

/**
 * Publish draft as article
 * POST /api/drafts/[id]/publish
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const draft = await prisma.contentDraft.findUnique({
      where: { id },
      include: {
        sources: true
      }
    })

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 })
    }

    // Check permissions
    if (
      draft.authorId !== session.user.id &&
      !["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!draft.draft) {
      return NextResponse.json({ error: "Draft content is empty" }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      categoryId,
      coverImage,
      publishNow = false,
      scheduledAt
    } = body

    // Generate SEO metadata if not provided
    const finalTitle = title || await generateSeoTitle(draft.draft)
    const metaTitle = await generateSeoTitle(draft.draft, finalTitle)
    const metaDescription = await generateMetaDescription(draft.draft)
    const keywords = await extractKeywords(draft.draft, 10)
    const tags = await generateTags(draft.draft, { maxTags: 5 })

    // Create slug
    const slug = createSlug(finalTitle)

    // Generate excerpt from content
    const excerpt = draft.draft.substring(0, 200).trim() + "..."

    // Create article
    const article = await prisma.article.create({
      data: {
        slug,
        title: finalTitle,
        excerpt,
        content: draft.draft,
        coverImage,
        
        type: "NEWS",
        status: publishNow ? "PUBLISHED" : "DRAFT",
        categoryId,
        
        authorId: draft.authorId,
        
        aiGenerated: draft.aiGenerated,
        aiSummary: excerpt,
        aiTags: tags,
        
        metaTitle,
        metaDescription,
        keywords,
        
        qualityScore: draft.qualityScore,
        
        publishedAt: publishNow ? new Date() : null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    })

    // Update draft status and link to article
    await prisma.contentDraft.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        articleId: article.id
      }
    })

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status
      }
    })
  } catch (error) {
    console.error("Draft publish error:", error)
    return NextResponse.json(
      {
        error: "Failed to publish draft",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

/**
 * Create URL-friendly slug
 */
function createSlug(text: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  }

  let slug = text.toLowerCase()
  
  Object.entries(turkishMap).forEach(([turkish, latin]) => {
    slug = slug.replace(new RegExp(turkish, 'g'), latin)
  })
  
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  if (slug.length > 100) {
    slug = slug.substring(0, 100)
    slug = slug.replace(/-$/, '')
  }
  
  // Add random suffix to ensure uniqueness
  const suffix = Math.random().toString(36).substring(2, 6)
  
  return `${slug}-${suffix}`
}
