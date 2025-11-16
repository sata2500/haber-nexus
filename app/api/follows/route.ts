import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Toggle follow on a user
 * POST /api/follows
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Can't follow yourself
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          id: existingFollow.id,
        },
      })

      return NextResponse.json({ following: false })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userId,
        },
      })

      // Create notification for followed user
      await prisma.notification.create({
        data: {
          userId: userId,
          type: "FOLLOW",
          title: "Yeni Takipçi",
          message: `${session.user.name || session.user.email} sizi takip etmeye başladı`,
          link: `/profile/${session.user.id}`,
        },
      })

      return NextResponse.json({ following: true })
    }
  } catch (error: unknown) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
}

/**
 * Check if user is following another user
 * GET /api/follows?userId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ following: false })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    return NextResponse.json({ following: !!follow })
  } catch (error: unknown) {
    console.error("Error checking follow:", error)
    return NextResponse.json({ error: "Failed to check follow" }, { status: 500 })
  }
}
