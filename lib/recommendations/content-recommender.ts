import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true
        name: true
        email: true
        image: true
      }
    }
    category: {
      select: {
        id: true
        name: true
        slug: true
        icon: true
      }
    }
    tags: {
      select: {
        id: true
        name: true
        slug: true
      }
    }
    _count: {
      select: {
        likes: true
        comments: true
        bookmarks: true
      }
    }
  }
}>

/**
 * Get personalized article recommendations for a user based on their interests
 */
export async function getPersonalizedRecommendations(
  userId: string,
  limit: number = 10
): Promise<ArticleWithRelations[]> {
  try {
    // Get user settings with interests
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      select: { interests: true },
    })

    // If no interests, return popular articles
    if (!settings || !settings.interests || settings.interests.length === 0) {
      return await getPopularArticles(limit)
    }

    const userInterests = settings.interests.map((i) => i.toLowerCase())

    // Get articles matching user interests
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          // Match category names
          {
            category: {
              name: {
                in: settings.interests,
                mode: "insensitive",
              },
            },
          },
          // Match tags
          {
            tags: {
              some: {
                name: {
                  in: settings.interests,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit * 2, // Get more for scoring
    })

    // Score articles based on interest match
    const scoredArticles = articles.map((article) => {
      let score = 0

      // Category match
      if (article.category) {
        const categoryName = article.category.name.toLowerCase()
        if (
          userInterests.some(
            (interest) => categoryName.includes(interest) || interest.includes(categoryName)
          )
        ) {
          score += 10
        }
      }

      // Tag matches
      article.tags.forEach((tag) => {
        const tagName = tag.name.toLowerCase()
        if (
          userInterests.some((interest) => tagName.includes(interest) || interest.includes(tagName))
        ) {
          score += 5
        }
      })

      // Engagement bonus
      score += article._count.likes * 0.5
      score += article._count.comments * 0.3
      score += article._count.bookmarks * 0.7

      // Recency bonus (newer articles get higher score)
      const daysOld = article.publishedAt
        ? (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
        : 999
      score += Math.max(0, 10 - daysOld)

      return {
        ...article,
        _recommendationScore: score,
      }
    })

    // Sort by score and return top N
    scoredArticles.sort((a, b) => b._recommendationScore - a._recommendationScore)

    return scoredArticles.slice(0, limit)
  } catch (error) {
    console.error("Error getting personalized recommendations:", error)
    // Fallback to popular articles
    return await getPopularArticles(limit)
  }
}

/**
 * Get popular articles as fallback
 */
async function getPopularArticles(limit: number = 10): Promise<ArticleWithRelations[]> {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
    })

    return articles
  } catch (error) {
    console.error("Error getting popular articles:", error)
    return []
  }
}

/**
 * Get recommended articles for homepage (for anonymous or users without interests)
 */
export async function getHomepageRecommendations(
  userId?: string,
  limit: number = 10
): Promise<ArticleWithRelations[]> {
  if (userId) {
    return await getPersonalizedRecommendations(userId, limit)
  }

  return await getPopularArticles(limit)
}
