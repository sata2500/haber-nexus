/**
 * Vision Enhancement Module
 * Handles image processing for articles:
 * - Analyzes source images from RSS feeds
 * - Generates AI images when appropriate
 * - Inserts images into article content
 */

import { GoogleGenAI } from "@google/genai"
import { generateImagePrompt } from "./prompts"
import { getNextGoogleApiKey, recordApiUsage } from "../services/api-key-manager"

export interface SourceImageAnalysis {
  hasImage: boolean
  imageUrl?: string
  isProductCatalog: boolean
  isInfographic: boolean
  shouldUseSource: boolean
  reasoning: string
}

export interface VisionEnhancementResult {
  strategy: "source-image" | "ai-generated" | "no-image"
  coverImage: {
    url: string
    altText: string
    description: string
  } | null
  contentImages: Array<{
    url: string
    altText: string
    placement: "after-intro" | "mid-content" | "before-conclusion"
  }>
  reasoning: string
}

/**
 * Analyze source image from RSS feed
 */
export async function analyzeSourceImage(
  imageUrl: string | undefined,
  title: string,
  _content: string
): Promise<SourceImageAnalysis> {
  if (!imageUrl) {
    return {
      hasImage: false,
      isProductCatalog: false,
      isInfographic: false,
      shouldUseSource: false,
      reasoning: "Kaynak içerikte görsel bulunamadı.",
    }
  }

  console.error(`[Vision Enhancer] Analyzing source image: ${imageUrl}`)

  // Simple heuristic-based analysis
  // Check if URL or title contains keywords that suggest special images
  const lowerTitle = title.toLowerCase()
  const lowerUrl = imageUrl.toLowerCase()

  const productCatalogKeywords = ["bim", "a101", "şok", "migros", "carrefour", "katalog", "ürün"]
  const infographicKeywords = ["infografik", "grafik", "chart", "diagram", "veri"]

  const isProductCatalog = productCatalogKeywords.some(
    (kw) => lowerTitle.includes(kw) || lowerUrl.includes(kw)
  )

  const isInfographic = infographicKeywords.some(
    (kw) => lowerTitle.includes(kw) || lowerUrl.includes(kw)
  )

  const shouldUseSource = isProductCatalog || isInfographic

  if (shouldUseSource) {
    console.error(
      `[Vision Enhancer] Source image detected as special content: ${isProductCatalog ? "Product Catalog" : "Infographic"}`
    )
  }

  return {
    hasImage: true,
    imageUrl,
    isProductCatalog,
    isInfographic,
    shouldUseSource,
    reasoning: shouldUseSource
      ? `Kaynak görsel ${isProductCatalog ? "ürün kataloğu" : "infografik"} olarak tespit edildi ve korundu.`
      : "Kaynak görsel genel bir görsel, yeni görsel oluşturulacak.",
  }
}

/**
 * Generate AI image for article using Google Imagen API
 */
export async function generateArticleImage(
  title: string,
  excerpt: string,
  keywords: string[]
): Promise<{
  url: string
  altText: string
  description: string
} | null> {
  try {
    console.error(`[Vision Enhancer] Generating AI image for: ${title}`)

    // Get next available API key
    const { key: apiKey, accountName } = getNextGoogleApiKey()
    console.error(`[Vision Enhancer] Using ${accountName} for image generation`)

    // Initialize client with selected API key
    const genAI = new GoogleGenAI({
      apiKey,
    })

    // Generate detailed prompt
    const prompt = generateImagePrompt(title, excerpt, keywords)

    console.error(`[Vision Enhancer] Image prompt: ${prompt}`)

    // Generate image using Imagen 4
    const response = await genAI.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
      },
    })

    if (!response.generatedImages || response.generatedImages.length === 0) {
      console.warn("[Vision Enhancer] No images generated")
      return null
    }

    const generatedImage = response.generatedImages![0]

    if (!generatedImage.image || !generatedImage.image.imageBytes) {
      console.warn("[Vision Enhancer] No image data received")
      return null
    }

    // Convert base64 to data URL
    const imageUrl = `data:${generatedImage.image.mimeType};base64,${generatedImage.image.imageBytes}`

    console.error(`[Vision Enhancer] Image generated successfully`)

    // Record API usage
    recordApiUsage(accountName)

    return {
      url: imageUrl,
      altText: title,
      description: `AI-generated image for: ${title}`,
    }
  } catch (error) {
    console.error("[Vision Enhancer] Failed to generate AI image:", error)
    return null
  }
}

/**
 * Enhance article with appropriate images
 */
export async function enhanceArticleWithImages(
  title: string,
  content: string,
  excerpt: string,
  keywords: string[],
  sourceImageUrl?: string
): Promise<VisionEnhancementResult> {
  console.error(`[Vision Enhancer] Starting image enhancement for: ${title}`)

  // Step 1: Analyze source image
  const sourceAnalysis = await analyzeSourceImage(sourceImageUrl, title, content)

  // Step 2: Decide on image strategy
  if (sourceAnalysis.shouldUseSource && sourceAnalysis.imageUrl) {
    console.error("[Vision Enhancer] Using source image")

    return {
      strategy: "source-image",
      coverImage: {
        url: sourceAnalysis.imageUrl,
        altText: title,
        description: `Source image for: ${title}`,
      },
      contentImages: [],
      reasoning: `Kaynak görseli kullanıldı: ${sourceAnalysis.reasoning}`,
    }
  }

  // Step 3: Generate AI image
  console.error("[Vision Enhancer] Generating AI image")

  const aiImage = await generateArticleImage(title, excerpt, keywords)

  if (aiImage) {
    return {
      strategy: "ai-generated",
      coverImage: {
        url: aiImage.url,
        altText: aiImage.altText,
        description: aiImage.description,
      },
      contentImages: [],
      reasoning: "Makale için yapay zeka ile profesyonel bir görsel oluşturuldu.",
    }
  }

  // Step 4: No image available
  console.warn("[Vision Enhancer] No image available")

  return {
    strategy: "no-image",
    coverImage: null,
    contentImages: [],
    reasoning:
      "Kaynak görseli uygun değil ve yapay zeka görsel oluşturma başarısız oldu. Görsel eklenmedi.",
  }
}

/**
 * Insert images into article content at appropriate positions
 */
export function insertImagesIntoContent(
  content: string,
  images: Array<{
    url: string
    altText: string
    placement: "after-intro" | "mid-content" | "before-conclusion"
  }>
): string {
  if (images.length === 0) {
    return content
  }

  let enhancedContent = content

  // Split content into paragraphs
  const paragraphs = content.split("\n\n")

  // Insert images at appropriate positions
  for (const image of images) {
    const imageMarkdown = `\n\n![${image.altText}](${image.url})\n\n`

    switch (image.placement) {
      case "after-intro":
        // After first paragraph
        if (paragraphs.length > 1) {
          paragraphs.splice(1, 0, imageMarkdown.trim())
        }
        break

      case "mid-content":
        // In the middle
        const midIndex = Math.floor(paragraphs.length / 2)
        paragraphs.splice(midIndex, 0, imageMarkdown.trim())
        break

      case "before-conclusion":
        // Before last paragraph
        if (paragraphs.length > 1) {
          paragraphs.splice(paragraphs.length - 1, 0, imageMarkdown.trim())
        }
        break
    }
  }

  enhancedContent = paragraphs.join("\n\n")

  return enhancedContent
}
