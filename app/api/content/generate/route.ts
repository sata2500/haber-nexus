import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateArticle, improveContent, expandOutline } from "@/lib/ai/content-generator"

/**
 * Generate content from topic
 * POST /api/content/generate
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only authors, editors, and admins can generate content
    if (!["AUTHOR", "EDITOR", "ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action, data } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    let result

    switch (action) {
      case "generate_article":
        if (!data.topic) {
          return NextResponse.json({ error: "Topic is required" }, { status: 400 })
        }

        console.log("Generating article for topic:", data.topic)
        
        // Generate article
        const generated = await generateArticle({
          topic: data.topic,
          style: data.style || "news",
          tone: data.tone || "professional",
          length: data.length || "medium",
          includeResearch: data.includeResearch !== false,
          includeSources: data.includeSources !== false,
          targetAudience: data.targetAudience || "genel okuyucu",
          keywords: data.keywords || []
        })

        console.log("Article generated successfully")
        console.log("Content length:", generated.content?.length || 0)
        console.log("Quality score:", generated.qualityScore)
        
        // Create draft
        const draft = await prisma.contentDraft.create({
          data: {
            authorId: session.user.id,
            topic: data.topic,
            outline: generated.outline,
            research: data.includeResearch ? ({ sources: generated.sources } as any) : undefined,
            draft: generated.content,
            
            aiGenerated: true,
            aiModel: generated.aiModel,
            aiPrompt: `Topic: ${data.topic}, Style: ${data.style || "news"}`,
            
            status: "REVIEW",
            
            qualityScore: generated.qualityScore,
            readabilityScore: generated.readabilityScore,
            seoScore: generated.seoScore
          }
        })

        console.log("Draft created with ID:", draft.id)
        
        result = {
          draftId: draft.id,
          ...generated
        }
        break

      case "improve_content":
        if (!data.content || !data.improvements) {
          return NextResponse.json(
            { error: "Content and improvements are required" },
            { status: 400 }
          )
        }

        const improved = await improveContent(data.content, data.improvements)
        result = { content: improved }
        break

      case "expand_outline":
        if (!data.outline || !data.topic) {
          return NextResponse.json(
            { error: "Outline and topic are required" },
            { status: 400 }
          )
        }

        const expanded = await expandOutline(
          data.outline,
          data.topic,
          data.style || "news"
        )
        result = { content: expanded }
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      action,
      result
    })
  } catch (error: unknown) {
    console.error("Content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate content",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
