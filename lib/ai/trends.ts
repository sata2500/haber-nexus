import { generateText } from "./gemini"
import { prisma } from "@/lib/prisma"

export interface TrendTopic {
  name: string
  count: number
  trend: "rising" | "stable" | "falling"
  score: number
  relatedTags: string[]
}

export interface TrendAnalysis {
  topics: TrendTopic[]
  recommendations: string[]
  insights: string[]
  period: {
    start: Date
    end: Date
  }
}

/**
 * Analyze trending topics from recent articles
 */
export async function analyzeTrends(options?: {
  days?: number
  minArticles?: number
}): Promise<TrendAnalysis> {
  const days = options?.days ?? 7
  const minArticles = options?.minArticles ?? 3

  // Get recent articles
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        gte: startDate,
      },
    },
    include: {
      tags: true,
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  })

  if (articles.length === 0) {
    return {
      topics: [],
      recommendations: ["Henüz yeterli veri yok"],
      insights: [],
      period: {
        start: startDate,
        end: new Date(),
      },
    }
  }

  // Prepare content for AI analysis
  const contents = articles
    .map((a) => `${a.title} | ${a.excerpt || ""} | Tags: ${a.tags.map((t) => t.name).join(", ")}`)
    .join("\n")

  const prompt = `
Aşağıdaki ${articles.length} makale başlığı, özeti ve tag'lerinden trend konuları tespit et.

JSON formatında yanıt ver:
{
  "topics": [
    {
      "name": "Yapay Zeka",
      "count": 15,
      "trend": "rising",
      "score": 0.85,
      "relatedTags": ["AI", "teknoloji", "otomasyon"]
    }
  ],
  "recommendations": [
    "Yapay zeka etiği hakkında derinlemesine bir analiz yazılabilir",
    "Teknoloji sektöründeki yeni trendler hakkında bir seri başlatılabilir"
  ],
  "insights": [
    "Yapay zeka konusu son 7 günde %40 artış gösterdi",
    "Okuyucular teknoloji ve inovasyon içeriklerine yüksek ilgi gösteriyor"
  ]
}

Açıklamalar:
- topics: Tespit edilen trend konular (en az ${minArticles} makalede geçmeli)
- name: Konu adı
- count: Kaç makalede geçtiği
- trend: rising (yükseliyor), stable (stabil), falling (düşüyor)
- score: Trend skoru (0-1, ne kadar popüler)
- relatedTags: İlgili tag'ler
- recommendations: İçerik stratejisi önerileri (3-5 adet)
- insights: Trend hakkında içgörüler (3-5 adet)

Sadece JSON yanıtı ver, başka açıklama ekleme.

Makaleler:
${contents.substring(0, 4000)}...

Analiz:
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.4 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      topics: Array.isArray(result.topics)
        ? result.topics.map((topic: { name?: string; count?: number; trend?: string; score?: number; relatedTags?: string[] }) => ({
            name: topic.name || "",
            count: topic.count || 0,
            trend: topic.trend || "stable",
            score: Math.max(0, Math.min(1, topic.score ?? 0.5)),
            relatedTags: Array.isArray(topic.relatedTags) ? topic.relatedTags : [],
          }))
        : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
      insights: Array.isArray(result.insights) ? result.insights : [],
      period: {
        start: startDate,
        end: new Date(),
      },
    }
  } catch (error) {
    console.error("Error analyzing trends:", error)
    return {
      topics: [],
      recommendations: ["Trend analizi yapılamadı"],
      insights: [],
      period: {
        start: startDate,
        end: new Date(),
      },
    }
  }
}

/**
 * Get personalized content recommendations for a user
 */
export async function getPersonalizedRecommendations(
  userId: string,
  limit: number = 10
): Promise<Array<{ articleId: string; score: number; reason: string }>> {
  // Get user's reading history
  const userLikes = await prisma.like.findMany({
    where: { userId },
    include: {
      article: {
        include: {
          tags: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  const userBookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      article: {
        include: {
          tags: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  const readArticles = [
    ...userLikes.map((l) => l.article),
    ...userBookmarks.map((b) => b.article),
  ]

  if (readArticles.length === 0) {
    // No history, return popular articles
    const popular = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [{ viewCount: "desc" }, { likeCount: "desc" }],
      take: limit,
    })

    return popular.map((article) => ({
      articleId: article.id,
      score: 0.5,
      reason: "Popüler içerik",
    }))
  }

  // Extract user interests
  const userInterests = readArticles
    .flatMap((a) => a.tags.map((t) => t.name))
    .join(", ")

  const userCategories = [...new Set(readArticles.map((a) => a.category?.name).filter(Boolean))].join(
    ", "
  )

  // Get candidate articles (not read yet)
  const readArticleIds = readArticles.map((a) => a.id)
  const candidates = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      id: { notIn: readArticleIds },
      publishedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    include: {
      tags: true,
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 50,
  })

  if (candidates.length === 0) {
    return []
  }

  // Score each candidate with AI
  const prompt = `
Kullanıcı ilgi alanları: ${userInterests}
Kullanıcı kategorileri: ${userCategories}

Aşağıdaki makaleleri kullanıcı için ne kadar ilginç olduğuna göre skorla (0-1 arası).

Makaleler:
${candidates
  .map(
    (a, i) =>
      `${i + 1}. ${a.title} | Kategori: ${a.category?.name || "Yok"} | Tags: ${a.tags.map((t) => t.name).join(", ")}`
  )
  .join("\n")}

JSON formatında yanıt ver (her makale için):
{
  "recommendations": [
    {
      "index": 1,
      "score": 0.85,
      "reason": "Kullanıcının yapay zeka konusuna olan ilgisiyle uyumlu"
    }
  ]
}

Sadece JSON yanıtı ver, başka açıklama ekleme.
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.3 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    if (!Array.isArray(result.recommendations)) {
      throw new Error("Invalid recommendations format")
    }

    type Recommendation = { articleId: string; score: number; reason: string }
    
    const recommendations: Recommendation[] = result.recommendations
      .map((rec: { index?: number; score?: number; reason?: string }): Recommendation | null => {
        if (!rec.index) return null
        const article = candidates[rec.index - 1]
        if (!article) return null

        return {
          articleId: article.id,
          score: Math.max(0, Math.min(1, rec.score ?? 0.5)),
          reason: rec.reason || "Önerildi",
        }
      })
      .filter((item: Recommendation | null): item is Recommendation => item !== null)
      .sort((a: Recommendation, b: Recommendation) => b.score - a.score)
      .slice(0, limit)

    return recommendations
  } catch (error) {
    console.error("Error getting personalized recommendations:", error)

    // Fallback: return recent articles
    return candidates.slice(0, limit).map((article) => ({
      articleId: article.id,
      score: 0.5,
      reason: "Son eklenen içerik",
    }))
  }
}

/**
 * Suggest content ideas based on trends
 */
export async function suggestContentIdeas(options?: {
  category?: string
  count?: number
}): Promise<
  Array<{
    title: string
    description: string
    keywords: string[]
    estimatedInterest: number
  }>
> {
  const count = options?.count ?? 5

  // Get recent trends
  const trends = await analyzeTrends({ days: 14 })

  const prompt = `
Son 14 günün trend konuları:
${trends.topics.map((t) => `- ${t.name} (${t.trend}, skor: ${t.score})`).join("\n")}

${options?.category ? `Kategori: ${options.category}` : ""}

Bu trendlere dayanarak ${count} adet yeni içerik fikri öner.

JSON formatında yanıt ver:
{
  "ideas": [
    {
      "title": "Yapay Zeka ve Etik: Geleceğin Zorlukları",
      "description": "Yapay zeka teknolojilerinin etik boyutlarını inceleyen derinlemesine bir analiz",
      "keywords": ["yapay zeka", "etik", "teknoloji", "gelecek"],
      "estimatedInterest": 0.85
    }
  ]
}

Açıklamalar:
- title: Çekici ve SEO dostu başlık
- description: İçerik açıklaması (1-2 cümle)
- keywords: Anahtar kelimeler (3-5 adet)
- estimatedInterest: Tahmini ilgi seviyesi (0-1)

Sadece JSON yanıtı ver, başka açıklama ekleme.
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.7 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    if (!Array.isArray(result.ideas)) {
      throw new Error("Invalid ideas format")
    }

    return result.ideas.map((idea: { title?: string; description?: string; keywords?: string[]; estimatedInterest?: number }) => ({
      title: idea.title || "",
      description: idea.description || "",
      keywords: Array.isArray(idea.keywords) ? idea.keywords : [],
      estimatedInterest: Math.max(0, Math.min(1, idea.estimatedInterest ?? 0.5)),
    }))
  } catch (error) {
    console.error("Error suggesting content ideas:", error)
    return []
  }
}
