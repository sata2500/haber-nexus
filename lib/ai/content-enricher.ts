import { GoogleGenerativeAI } from "@google/generative-ai"
import {
  generateEnrichmentSystemPrompt,
  generateEnrichmentEvaluationPrompt,
  generateEnrichmentWritingPrompt,
} from "./prompts"
import { searchWeb, formatResearchFindings } from "./search-helper"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export interface ContentEvaluationResult {
  enrichmentNeeded: boolean
  reasoning: string
  missingElements: string[]
  suggestedSearchQueries: string[]
}

export interface EnrichmentResult {
  enriched: boolean
  originalContent: string
  enrichedContent: string
  addedSections: string[]
  researchSources: string[]
  reasoning: string
}

/**
 * Evaluate if content needs enrichment
 */
export async function evaluateContentDepth(
  title: string,
  content: string,
  excerpt: string
): Promise<ContentEvaluationResult> {
  try {
    console.error(`[Content Enricher] Evaluating content depth for: ${title}`)

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = generateEnrichmentEvaluationPrompt(title, content, excerpt)

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    console.error(`[Content Enricher] Evaluation response: ${response}`)

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse evaluation response")
    }

    const evaluation: ContentEvaluationResult = JSON.parse(jsonMatch[0])

    console.error(
      `[Content Enricher] Enrichment needed: ${evaluation.enrichmentNeeded}, Reason: ${evaluation.reasoning}`
    )

    return evaluation
  } catch (error) {
    console.error("[Content Enricher] Error evaluating content:", error)
    // Default to not enriching if evaluation fails
    return {
      enrichmentNeeded: false,
      reasoning: "Değerlendirme hatası oluştu, zenginleştirme atlandı.",
      missingElements: [],
      suggestedSearchQueries: [],
    }
  }
}

/**
 * Conduct research using search queries
 */
export async function conductResearch(
  searchQueries: string[],
  _maxResultsPerQuery: number = 3
): Promise<{
  findings: string
  sources: string[]
}> {
  console.error(`[Content Enricher] Conducting research with ${searchQueries.length} queries`)

  // Use search helper to conduct actual web search
  const searchResults = await searchWeb(searchQueries)

  // Format findings from search results
  const findings = formatResearchFindings(searchResults)
  const allSources = searchResults.map((r) => r.url)

  console.error(`[Content Enricher] Research completed. Found ${allSources.length} sources.`)

  return {
    findings,
    sources: allSources,
  }
}

/**
 * Generate enriched content using AI
 */
export async function generateEnrichedContent(
  title: string,
  originalContent: string,
  researchFindings: string,
  missingElements: string[]
): Promise<string> {
  try {
    console.error(`[Content Enricher] Generating enriched content for: ${title}`)

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: generateEnrichmentSystemPrompt(),
    })

    const prompt = generateEnrichmentWritingPrompt(
      title,
      originalContent,
      researchFindings,
      missingElements
    )

    const result = await model.generateContent(prompt)
    const enrichedContent = result.response.text()

    console.error(
      `[Content Enricher] Enriched content generated. Length: ${enrichedContent.length} chars`
    )

    return enrichedContent.trim()
  } catch (error) {
    console.error("[Content Enricher] Error generating enriched content:", error)
    // Return original content if enrichment fails
    return originalContent
  }
}

/**
 * Main function to enrich article content
 */
export async function enrichArticleContent(
  title: string,
  content: string,
  excerpt: string,
  _keywords: string[]
): Promise<EnrichmentResult> {
  console.error(`[Content Enricher] Starting content enrichment for: ${title}`)

  // Step 1: Evaluate if enrichment is needed
  const evaluation = await evaluateContentDepth(title, content, excerpt)

  if (!evaluation.enrichmentNeeded) {
    console.error(`[Content Enricher] No enrichment needed: ${evaluation.reasoning}`)
    return {
      enriched: false,
      originalContent: content,
      enrichedContent: content,
      addedSections: [],
      researchSources: [],
      reasoning: evaluation.reasoning,
    }
  }

  // Step 2: Conduct research
  const { findings, sources } = await conductResearch(evaluation.suggestedSearchQueries)

  // Step 3: Generate enriched content
  const enrichedContent = await generateEnrichedContent(
    title,
    content,
    findings,
    evaluation.missingElements
  )

  // Step 4: Identify added sections (simple heuristic: new paragraphs)
  const originalParagraphs = content.split("\n\n").length
  const enrichedParagraphs = enrichedContent.split("\n\n").length
  const addedSections = [`${enrichedParagraphs - originalParagraphs} yeni paragraf eklendi`]

  console.error(`[Content Enricher] Enrichment completed. Added ${addedSections.length} sections.`)

  return {
    enriched: true,
    originalContent: content,
    enrichedContent,
    addedSections,
    researchSources: sources,
    reasoning: `İçerik zenginleştirildi: ${evaluation.missingElements.join(", ")} bilgileri eklendi.`,
  }
}

/**
 * Enhanced version with actual search integration
 * This function will be used once search tool is properly integrated
 */
export async function enrichArticleContentWithSearch(
  title: string,
  content: string,
  excerpt: string,
  keywords: string[],
  searchFunction: (
    queries: string[]
  ) => Promise<Array<{ title: string; url: string; snippet: string }>>
): Promise<EnrichmentResult> {
  console.error(`[Content Enricher] Starting enhanced content enrichment for: ${title}`)

  // Step 1: Evaluate if enrichment is needed
  const evaluation = await evaluateContentDepth(title, content, excerpt)

  if (!evaluation.enrichmentNeeded) {
    console.error(`[Content Enricher] No enrichment needed: ${evaluation.reasoning}`)
    return {
      enriched: false,
      originalContent: content,
      enrichedContent: content,
      addedSections: [],
      researchSources: [],
      reasoning: evaluation.reasoning,
    }
  }

  // Step 2: Conduct actual research using provided search function
  console.error(
    `[Content Enricher] Conducting research with ${evaluation.suggestedSearchQueries.length} queries`
  )

  const searchResults = await searchFunction(evaluation.suggestedSearchQueries.slice(0, 3))

  // Format findings from search results
  const findings = searchResults
    .map(
      (result, i) => `**Kaynak ${i + 1}: ${result.title}**\nURL: ${result.url}\n${result.snippet}`
    )
    .join("\n\n")

  const sources = searchResults.map((r) => r.url)

  console.error(`[Content Enricher] Research completed. Found ${sources.length} sources.`)

  // Step 3: Generate enriched content
  const enrichedContent = await generateEnrichedContent(
    title,
    content,
    findings,
    evaluation.missingElements
  )

  // Step 4: Identify added sections
  const originalParagraphs = content.split("\n\n").length
  const enrichedParagraphs = enrichedContent.split("\n\n").length
  const addedSections = [`${enrichedParagraphs - originalParagraphs} yeni paragraf eklendi`]

  console.error(`[Content Enricher] Enrichment completed. Added ${addedSections.length} sections.`)

  return {
    enriched: true,
    originalContent: content,
    enrichedContent,
    addedSections,
    researchSources: sources,
    reasoning: `İçerik zenginleştirildi: ${evaluation.missingElements.join(", ")} bilgileri eklendi.`,
  }
}
