import { processRssItem, type ProcessedContent } from "./processor"
import {
  enhanceArticleWithImages,
  insertImagesIntoContent,
  type VisionEnhancementResult,
} from "./vision-enhancer"
import { enrichArticleContent, type EnrichmentResult } from "./content-enricher"
import type { RssItem } from "../rss/parser"

export interface EnhancedProcessedContent extends ProcessedContent {
  // Vision enhancement
  visionEnhancement: VisionEnhancementResult
  coverImage: string | null
  coverImageAltText: string | null
  coverImageDescription: string | null

  // Content enrichment
  contentEnrichment: EnrichmentResult
  enrichedContent: string
  researchSources: string[]
}

/**
 * Process RSS item with enhanced features:
 * - Basic AI processing (title, excerpt, content rewrite, tags, SEO)
 * - Vision enhancement (source images or AI-generated images)
 * - Content enrichment (research and depth)
 */
export async function enhancedProcessRssItem(
  item: RssItem,
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
    enableVisionEnhancement?: boolean
    enableContentEnrichment?: boolean
  }
): Promise<EnhancedProcessedContent> {
  const enableVision = options?.enableVisionEnhancement ?? true
  const enableEnrichment = options?.enableContentEnrichment ?? true

  console.error(`[Enhanced Processor] Starting enhanced processing for: ${item.title}`)
  console.error(`[Enhanced Processor] Vision: ${enableVision}, Enrichment: ${enableEnrichment}`)

  // Step 1: Basic AI processing
  console.error(`[Enhanced Processor] Step 1: Basic AI processing`)
  const basicProcessed = await processRssItem(item, {
    rewriteStyle: options?.rewriteStyle,
    minQualityScore: options?.minQualityScore,
    generateNewContent: options?.generateNewContent,
  })

  // Step 2: Content enrichment (do this before vision to have final content)
  let contentEnrichment: EnrichmentResult = {
    enriched: false,
    originalContent: basicProcessed.content,
    enrichedContent: basicProcessed.content,
    addedSections: [],
    researchSources: [],
    reasoning: "Content enrichment disabled",
  }

  if (enableEnrichment) {
    console.error(`[Enhanced Processor] Step 2: Content enrichment`)
    try {
      contentEnrichment = await enrichArticleContent(
        basicProcessed.title,
        basicProcessed.content,
        basicProcessed.excerpt,
        basicProcessed.keywords
      )
    } catch (error) {
      console.error("[Enhanced Processor] Content enrichment failed:", error)
      // Continue with original content
    }
  } else {
    console.error(`[Enhanced Processor] Step 2: Content enrichment (skipped)`)
  }

  // Use enriched content for further processing
  const finalContent = contentEnrichment.enrichedContent

  // Step 3: Vision enhancement
  let visionEnhancement: VisionEnhancementResult = {
    coverImage: null,
    contentImages: [],
    strategy: "no-image",
    reasoning: "Vision enhancement disabled",
  }

  if (enableVision) {
    console.error(`[Enhanced Processor] Step 3: Vision enhancement`)
    try {
      visionEnhancement = await enhanceArticleWithImages(
        item.content, // Use original RSS content for source image extraction
        basicProcessed.title,
        basicProcessed.excerpt,
        basicProcessed.keywords
      )
    } catch (error) {
      console.error("[Enhanced Processor] Vision enhancement failed:", error)
      // Continue without images
    }
  } else {
    console.error(`[Enhanced Processor] Step 3: Vision enhancement (skipped)`)
  }

  // Step 4: Insert content images into article body
  let contentWithImages = finalContent
  if (visionEnhancement.contentImages.length > 0) {
    console.error(
      `[Enhanced Processor] Step 4: Inserting ${visionEnhancement.contentImages.length} images into content`
    )
    contentWithImages = insertImagesIntoContent(finalContent, visionEnhancement.contentImages)
  } else {
    console.error(`[Enhanced Processor] Step 4: No content images to insert`)
  }

  // Prepare final result
  const result: EnhancedProcessedContent = {
    ...basicProcessed,

    // Override content with enriched and image-enhanced version
    content: contentWithImages,

    // Vision enhancement
    visionEnhancement,
    coverImage: visionEnhancement.coverImage?.url || null,
    coverImageAltText: visionEnhancement.coverImage?.altText || null,
    coverImageDescription: visionEnhancement.coverImage?.description || null,

    // Content enrichment
    contentEnrichment,
    enrichedContent: contentWithImages,
    researchSources: contentEnrichment.researchSources,
  }

  console.error(`[Enhanced Processor] Enhanced processing completed for: ${item.title}`)
  console.error(`[Enhanced Processor] - Cover image: ${result.coverImage ? "✓" : "✗"}`)
  console.error(`[Enhanced Processor] - Content images: ${visionEnhancement.contentImages.length}`)
  console.error(
    `[Enhanced Processor] - Content enriched: ${contentEnrichment.enriched ? "✓" : "✗"}`
  )
  console.error(
    `[Enhanced Processor] - Research sources: ${contentEnrichment.researchSources.length}`
  )

  return result
}

/**
 * Batch process multiple RSS items with enhanced features
 */
export async function batchEnhancedProcessRssItems(
  items: RssItem[],
  options?: {
    rewriteStyle?: "formal" | "casual" | "news" | "blog"
    minQualityScore?: number
    generateNewContent?: boolean
    enableVisionEnhancement?: boolean
    enableContentEnrichment?: boolean
    onProgress?: (current: number, total: number) => void
  }
): Promise<{
  successful: EnhancedProcessedContent[]
  failed: Array<{ item: RssItem; error: string }>
}> {
  const successful: EnhancedProcessedContent[] = []
  const failed: Array<{ item: RssItem; error: string }> = []

  console.error(`[Enhanced Processor] Starting batch processing of ${items.length} items`)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    try {
      const processed = await enhancedProcessRssItem(item, options)
      successful.push(processed)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      console.error(`[Enhanced Processor] Failed to process item "${item.title}":`, errorMsg)
      failed.push({
        item,
        error: errorMsg,
      })
    }

    // Report progress
    if (options?.onProgress) {
      options.onProgress(i + 1, items.length)
    }
  }

  console.error(`[Enhanced Processor] Batch processing completed:`)
  console.error(`[Enhanced Processor] - Successful: ${successful.length}`)
  console.error(`[Enhanced Processor] - Failed: ${failed.length}`)

  return { successful, failed }
}
