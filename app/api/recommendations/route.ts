import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getHomepageRecommendations } from "@/lib/recommendations/content-recommender"

/**
 * Get personalized article recommendations
 * GET /api/recommendations
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")

    const recommendations = await getHomepageRecommendations(
      session?.user?.id,
      Math.min(limit, 50) // Max 50
    )

    return NextResponse.json({
      recommendations,
      personalized: !!session?.user?.id,
    })
  } catch (error: unknown) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    )
  }
}
