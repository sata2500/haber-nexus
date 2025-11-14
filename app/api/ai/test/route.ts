import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  generateText,
  summarizeContent,
  generateTags,
  generateSeoTitle,
  generateMetaDescription,
  analyzeQuality,
  extractKeywords,
} from "@/lib/ai/gemini"

/**
 * Test AI functions
 * POST /api/ai/test
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, content } = body

    if (!action || !content) {
      return NextResponse.json(
        { error: "Action and content are required" },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case "summarize":
        result = await summarizeContent(content, { style: "brief" })
        break

      case "tags":
        result = await generateTags(content, { maxTags: 5 })
        break

      case "seo_title":
        result = await generateSeoTitle(content)
        break

      case "meta_description":
        result = await generateMetaDescription(content)
        break

      case "quality":
        result = await analyzeQuality(content)
        break

      case "keywords":
        result = await extractKeywords(content, 10)
        break

      case "generate":
        result = await generateText(content)
        break

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      action,
      result,
    })
  } catch (error) {
    console.error("AI test error:", error)
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 }
    )
  }
}
