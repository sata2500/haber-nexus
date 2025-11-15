import { prisma } from "@/lib/prisma"

/**
 * Find best matching author for a category based on interests
 */
export async function findBestAuthorForCategory(categoryId: string): Promise<string | null> {
  try {
    // Get category details
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true, slug: true }
    })

    if (!category) return null

    // Get all authors with their profiles
    const authors = await prisma.user.findMany({
      where: {
        role: { in: ["AUTHOR", "ADMIN", "SUPER_ADMIN"] }
      },
      include: {
        authorProfile: true,
        _count: {
          select: {
            articles: true
          }
        }
      }
    })

    if (authors.length === 0) return null

    // Score each author based on interests match
    const scoredAuthors = authors.map(author => {
      let score = 0
      
      // Check if author has interests
      if (author.authorProfile?.interests && author.authorProfile.interests.length > 0) {
        const interests = author.authorProfile.interests.map(i => i.toLowerCase())
        const categoryName = category.name.toLowerCase()
        const categorySlug = category.slug.toLowerCase()
        
        // Exact match
        if (interests.includes(categoryName) || interests.includes(categorySlug)) {
          score += 10
        }
        
        // Partial match
        interests.forEach(interest => {
          if (categoryName.includes(interest) || interest.includes(categoryName)) {
            score += 5
          }
          if (categorySlug.includes(interest) || interest.includes(categorySlug)) {
            score += 3
          }
        })
      }
      
      // Bonus for expertise
      if (author.authorProfile?.expertise && author.authorProfile.expertise.length > 0) {
        const expertise = author.authorProfile.expertise.map(e => e.toLowerCase())
        const categoryName = category.name.toLowerCase()
        
        if (expertise.some(exp => categoryName.includes(exp) || exp.includes(categoryName))) {
          score += 7
        }
      }
      
      // Bonus for verified authors
      if (author.authorProfile?.verified) {
        score += 2
      }
      
      // Small bonus for experience (number of articles)
      score += Math.min(author._count.articles * 0.1, 3)
      
      return {
        authorId: author.id,
        score,
        name: author.name || author.email
      }
    })

    // Sort by score descending
    scoredAuthors.sort((a, b) => b.score - a.score)

    // Return best match if score is above threshold
    const bestMatch = scoredAuthors[0]
    if (bestMatch && bestMatch.score > 0) {
      return bestMatch.authorId
    }

    // Fallback: return first admin/super_admin
    const fallbackAuthor = authors.find(a => 
      a.role === "SUPER_ADMIN" || a.role === "ADMIN"
    )
    
    return fallbackAuthor?.id || authors[0]?.id || null
  } catch (error) {
    console.error("Error finding best author:", error)
    return null
  }
}

/**
 * Get default author for RSS feed
 */
export async function getAuthorForRssFeed(feedId: string, categoryId?: string): Promise<string> {
  try {
    // Get feed settings
    const feed = await prisma.rssFeed.findUnique({
      where: { id: feedId },
      select: {
        autoAssignAuthor: true,
        defaultAuthorId: true,
        categoryId: true
      }
    })

    if (!feed) {
      throw new Error("RSS feed not found")
    }

    // If auto assignment is disabled, use default author
    if (!feed.autoAssignAuthor) {
      if (feed.defaultAuthorId) {
        return feed.defaultAuthorId
      }
      // Fallback to first admin
      const admin = await prisma.user.findFirst({
        where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }
      })
      return admin?.id || ""
    }

    // Auto assignment is enabled
    const targetCategoryId = categoryId || feed.categoryId
    
    if (targetCategoryId) {
      const bestAuthor = await findBestAuthorForCategory(targetCategoryId)
      if (bestAuthor) {
        return bestAuthor
      }
    }

    // Fallback to default author
    if (feed.defaultAuthorId) {
      return feed.defaultAuthorId
    }

    // Final fallback to first admin
    const admin = await prisma.user.findFirst({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }
    })
    
    return admin?.id || ""
  } catch (error) {
    console.error("Error getting author for RSS feed:", error)
    throw error
  }
}
