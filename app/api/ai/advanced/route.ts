import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { analyzeImage } from "@/lib/ai/vision"
import { analyzeSentiment } from "@/lib/ai/sentiment"
import { moderateContent, checkFactAccuracy } from "@/lib/ai/moderation"
import { translateContent } from "@/lib/ai/translation"
import { analyzeTrends, getPersonalizedRecommendations, suggestContentIdeas } from "@/lib/ai/trends"

/**
 * Advanced AI operations endpoint
 * POST /api/ai/advanced
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins and editors can use advanced features
    if (!["ADMIN", "SUPER_ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { action, data } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
    }

    let result

    switch (action) {
      case "analyze_image":
        if (!data.imageUrl) {
          return NextResponse.json({ error: "imageUrl is required" }, { status: 400 })
        }
        result = await analyzeImage(data.imageUrl)
        break

      case "analyze_sentiment":
        if (!data.content) {
          return NextResponse.json({ error: "content is required" }, { status: 400 })
        }
        result = await analyzeSentiment(data.content)
        break

      case "moderate_content":
        if (!data.content) {
          return NextResponse.json({ error: "content is required" }, { status: 400 })
        }
        result = await moderateContent(data.content)
        break

      case "check_facts":
        if (!data.content) {
          return NextResponse.json({ error: "content is required" }, { status: 400 })
        }
        result = await checkFactAccuracy(data.content)
        break

      case "translate":
        if (!data.content || !data.targetLang) {
          return NextResponse.json(
            { error: "content and targetLang are required" },
            { status: 400 }
          )
        }
        result = await translateContent(data.content, data.targetLang, data.sourceLang)
        break

      case "analyze_trends":
        result = await analyzeTrends({
          days: data.days || 7,
          minArticles: data.minArticles || 3,
        })
        break

      case "personalized_recommendations":
        if (!data.userId) {
          return NextResponse.json({ error: "userId is required" }, { status: 400 })
        }
        result = await getPersonalizedRecommendations(data.userId, data.limit || 10)
        break

      case "suggest_content_ideas":
        result = await suggestContentIdeas({
          category: data.category,
          count: data.count || 5,
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      action,
      result,
    })
  } catch (error) {
    console.error("Advanced AI error:", error)
    return NextResponse.json(
      {
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
