import { processRssItem, type ProcessedContent } from "./processor"
import { analyzeImage, extractAndAnalyzeImages, selectBestCoverImage } from "./vision"
import { analyzeSentiment, type SentimentAnalysis } from "./sentiment"
import { moderateContent, checkFactAccuracy, type ModerationResult } from "./moderation"
import { translateArticle, detectLanguage, type SupportedLanguage } from "./translation"
import type { RssItem } from "../rss/parser"

export interface AdvancedProcessedContent extends ProcessedContent {
  // Vision
  coverImage?: {
    url: string
    altText: string
    description: string
    tags: string[]
  }
  images: Array<{
    url: string
    altText: string
    description: string
  }>

  // Sentiment
  sentiment: SentimentAnalysis

  // Moderation
  moderation: ModerationResult

  // Fact checking
  factCheck: {
    reliable: boolean
    confidence: number
    overallScore: number
  }

  // Translation
  detectedLanguage?: SupportedLanguage
  translations?: Record<SupportedLanguage, {
    title: string
    excerpt: string
    content: string
  }>
}

/**
 * Process RSS item with advanced AI features
 */
export async function advancedProcessRssItem(
  item: RssItem,
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
    analyzeImages?: boolean
    checkFacts?: boolean
    analyzeSentiment?: boolean
    translateTo?: SupportedLanguage[]
    strictModeration?: boolean
  }
): Promise<AdvancedProcessedContent> {
  // Basic processing
  const basicProcessed = await processRssItem(item, {
    rewriteStyle: options?.rewriteStyle,
    minQualityScore: options?.minQualityScore,
    generateNewContent: options?.generateNewContent,
  })

  // Initialize advanced content
  const advancedContent: AdvancedProcessedContent = {
    ...basicProcessed,
    images: [],
    sentiment: {
      sentiment: "neutral",
      score: 0,
      confidence: 0,
      emotions: {
        joy: 0,
        anger: 0,
        sadness: 0,
        fear: 0,
        surprise: 0,
        trust: 0,
      },
      tone: [],
    },
    moderation: {
      safe: true,
      categories: {
        hate: 0,
        violence: 0,
        sexual: 0,
        selfHarm: 0,
        spam: 0,
        misinformation: 0,
        harassment: 0,
      },
      flaggedPhrases: [],
      recommendation: "approve",
    },
    factCheck: {
      reliable: true,
      confidence: 0,
      overallScore: 0.5,
    },
  }

  // Moderation (always run for safety)
  try {
    advancedContent.moderation = await moderateContent(basicProcessed.content)

    if (options?.strictModeration && advancedContent.moderation.recommendation === "reject") {
      throw new Error("Content rejected by moderation: " + advancedContent.moderation.reason)
    }
  } catch (error) {
    console.error("Moderation error:", error)
    if (options?.strictModeration) {
      throw error
    }
  }

  // Image analysis
  if (options?.analyzeImages !== false) {
    try {
      const analyzedImages = await extractAndAnalyzeImages(item.content)

      if (analyzedImages.length > 0) {
        // Store all images
        advancedContent.images = analyzedImages.map((img) => ({
          url: img.url,
          altText: img.analysis.altText,
          description: img.analysis.description,
        }))

        // Select best cover image
        const bestCover = selectBestCoverImage(analyzedImages)
        if (bestCover) {
          advancedContent.coverImage = {
            url: bestCover.url,
            altText: bestCover.analysis.altText,
            description: bestCover.analysis.description,
            tags: bestCover.analysis.tags,
          }
        }
      }
    } catch (error) {
      console.error("Image analysis error:", error)
      // Continue without images
    }
  }

  // Sentiment analysis
  if (options?.analyzeSentiment !== false) {
    try {
      advancedContent.sentiment = await analyzeSentiment(basicProcessed.content)
    } catch (error) {
      console.error("Sentiment analysis error:", error)
      // Continue with default sentiment
    }
  }

  // Fact checking
  if (options?.checkFacts) {
    try {
      const factCheck = await checkFactAccuracy(basicProcessed.content)
      advancedContent.factCheck = {
        reliable: factCheck.reliable,
        confidence: factCheck.confidence,
        overallScore: factCheck.overallScore,
      }

      // Reject if unreliable and strict moderation
      if (options?.strictModeration && !factCheck.reliable && factCheck.confidence > 0.7) {
        throw new Error("Content contains unreliable information")
      }
    } catch (error) {
      console.error("Fact checking error:", error)
      if (options?.strictModeration) {
        throw error
      }
    }
  }

  // Language detection
  try {
    const detected = await detectLanguage(basicProcessed.content)
    advancedContent.detectedLanguage = detected.language
  } catch (error) {
    console.error("Language detection error:", error)
  }

  // Translation
  if (options?.translateTo && options.translateTo.length > 0) {
    advancedContent.translations = {} as Record<SupportedLanguage, {
      title: string
      excerpt: string
      content: string
    }>

    for (const targetLang of options.translateTo) {
      try {
        const translated = await translateArticle(
          {
            title: basicProcessed.title,
            excerpt: basicProcessed.excerpt,
            content: basicProcessed.content,
            metaTitle: basicProcessed.metaTitle,
            metaDescription: basicProcessed.metaDescription,
          },
          targetLang
        )

        advancedContent.translations[targetLang] = translated
      } catch (error) {
        console.error(`Translation error for ${targetLang}:`, error)
        // Continue with other translations
      }
    }
  }

  return advancedContent
}

/**
 * Batch process RSS items with advanced features
 */
export async function batchAdvancedProcessRssItems(
  items: RssItem[],
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
    analyzeImages?: boolean
    checkFacts?: boolean
    analyzeSentiment?: boolean
    translateTo?: SupportedLanguage[]
    strictModeration?: boolean
    onProgress?: (current: number, total: number) => void
  }
): Promise<{
  successful: AdvancedProcessedContent[]
  failed: Array<{ item: RssItem; error: string }>
}> {
  const successful: AdvancedProcessedContent[] = []
  const failed: Array<{ item: RssItem; error: string }> = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    try {
      const processed = await advancedProcessRssItem(item, options)
      successful.push(processed)
    } catch (error) {
      failed.push({
        item,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Report progress
    if (options?.onProgress) {
      options.onProgress(i + 1, items.length)
    }
  }

  return { successful, failed }
}

/**
 * Generate comprehensive article report
 */
export async function generateArticleReport(
  content: AdvancedProcessedContent
): Promise<{
  summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  overallScore: number
}> {
  const report = {
    summary: "",
    strengths: [] as string[],
    weaknesses: [] as string[],
    recommendations: [] as string[],
    overallScore: 0,
  }

  // Quality score
  if (content.qualityScore > 0.7) {
    report.strengths.push(`Yüksek kalite skoru: ${(content.qualityScore * 100).toFixed(0)}%`)
  } else if (content.qualityScore < 0.5) {
    report.weaknesses.push(`Düşük kalite skoru: ${(content.qualityScore * 100).toFixed(0)}%`)
    report.recommendations.push("İçerik kalitesi iyileştirilmeli")
  }

  // Moderation
  if (content.moderation.safe) {
    report.strengths.push("İçerik güvenlik kontrollerinden geçti")
  } else {
    report.weaknesses.push("İçerik güvenlik sorunları içeriyor")
    report.recommendations.push("Moderasyon gerekiyor: " + content.moderation.reason)
  }

  // Fact check
  if (content.factCheck.overallScore > 0.7) {
    report.strengths.push("Güvenilir bilgi içeriği")
  } else if (content.factCheck.overallScore < 0.5) {
    report.weaknesses.push("Bilgi güvenilirliği düşük")
    report.recommendations.push("Kaynak doğrulaması yapılmalı")
  }

  // Sentiment
  const sentimentText =
    content.sentiment.sentiment === "positive"
      ? "Pozitif"
      : content.sentiment.sentiment === "negative"
        ? "Negatif"
        : "Nötr"
  report.strengths.push(`Duygu tonu: ${sentimentText}`)

  // Images
  if (content.coverImage) {
    report.strengths.push("Kapak görseli mevcut")
  } else {
    report.weaknesses.push("Kapak görseli eksik")
    report.recommendations.push("Görsel içerik eklenmeli")
  }

  // SEO
  if (content.keywords.length >= 5) {
    report.strengths.push(`${content.keywords.length} anahtar kelime belirlendi`)
  } else {
    report.recommendations.push("Daha fazla anahtar kelime eklenmeli")
  }

  // Calculate overall score
  let scoreSum = 0
  let scoreCount = 0

  scoreSum += content.qualityScore
  scoreCount++

  if (content.moderation.safe) {
    scoreSum += 1
    scoreCount++
  }

  scoreSum += content.factCheck.overallScore
  scoreCount++

  scoreSum += content.sentiment.confidence
  scoreCount++

  report.overallScore = scoreSum / scoreCount

  // Generate summary
  report.summary = `
İçerik genel skoru: ${(report.overallScore * 100).toFixed(0)}%
Kalite: ${(content.qualityScore * 100).toFixed(0)}%
Güvenilirlik: ${(content.factCheck.overallScore * 100).toFixed(0)}%
Duygu: ${sentimentText} (${(content.sentiment.score * 100).toFixed(0)}%)
`.trim()

  return report
}
