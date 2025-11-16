/**
 * Quality Filter Service
 * Filters RSS items based on quality criteria to produce fewer, higher-quality articles
 */

// Quality filter works with generic item types

export interface QualityFilterConfig {
  minTitleLength: number
  minContentLength: number
  maxArticlesPerDay: number
  minQualityScore: number
  priorityKeywords: string[]
  excludeKeywords: string[]
  diversityWindow: number // hours
}

export interface QualityFilterResult {
  passed: boolean
  score: number
  reasons: string[]
  shouldProcess: boolean
}

/**
 * Default quality filter configuration
 */
const DEFAULT_CONFIG: QualityFilterConfig = {
  minTitleLength: 20, // Minimum title length in characters
  minContentLength: 200, // Minimum content length in characters
  maxArticlesPerDay: 30, // Maximum articles to process per day (down from 100)
  minQualityScore: 0.7, // Minimum quality score (0-1)
  priorityKeywords: [
    // High-value topics
    "ekonomi",
    "teknoloji",
    "sağlık",
    "eğitim",
    "bilim",
    "çevre",
    "politika",
    "dünya",
    "analiz",
    "özel haber",
    "röportaj",
  ],
  excludeKeywords: [
    // Low-value or spam indicators
    "tıkla",
    "şok",
    "inanılmaz",
    "reklam",
    "sponsor",
    "çekiliş",
    "kampanya",
  ],
  diversityWindow: 24, // Check for similar articles in last 24 hours
}

/**
 * Calculate quality score for RSS item
 */
export function calculateQualityScore(
  item: {
    title: string
    description?: string | null
    content?: string
  },
  config: QualityFilterConfig = DEFAULT_CONFIG
): QualityFilterResult {
  const reasons: string[] = []
  let score = 0.5 // Base score

  const title = item.title || ""
  const content = item.description || item.content || ""

  // 1. Title length check
  if (title.length < config.minTitleLength) {
    reasons.push(`Başlık çok kısa (${title.length} < ${config.minTitleLength})`)
    score -= 0.2
  } else if (title.length > 50) {
    reasons.push("Başlık uygun uzunlukta")
    score += 0.1
  }

  // 2. Content length check
  if (content.length < config.minContentLength) {
    reasons.push(`İçerik çok kısa (${content.length} < ${config.minContentLength})`)
    score -= 0.3
  } else if (content.length > 500) {
    reasons.push("İçerik yeterli uzunlukta")
    score += 0.2
  }

  // 3. Priority keywords check
  const lowerTitle = title.toLowerCase()
  const lowerContent = content.toLowerCase()
  const foundPriorityKeywords = config.priorityKeywords.filter(
    (kw) => lowerTitle.includes(kw) || lowerContent.includes(kw)
  )

  if (foundPriorityKeywords.length > 0) {
    reasons.push(`Öncelikli anahtar kelimeler bulundu: ${foundPriorityKeywords.join(", ")}`)
    score += 0.2 * Math.min(foundPriorityKeywords.length, 3) // Max +0.6
  }

  // 4. Exclude keywords check
  const foundExcludeKeywords = config.excludeKeywords.filter(
    (kw) => lowerTitle.includes(kw) || lowerContent.includes(kw)
  )

  if (foundExcludeKeywords.length > 0) {
    reasons.push(`Düşük kalite göstergeleri: ${foundExcludeKeywords.join(", ")}`)
    score -= 0.3 * foundExcludeKeywords.length
  }

  // 5. Clickbait detection
  const clickbaitPatterns = [
    /!{2,}/, // Multiple exclamation marks
    /\?{2,}/, // Multiple question marks
    /[A-Z]{5,}/, // All caps words
    /şok|inanılmaz|muhteşem|korkunç/i,
  ]

  const hasClickbait = clickbaitPatterns.some((pattern) => pattern.test(title))
  if (hasClickbait) {
    reasons.push("Clickbait göstergeleri tespit edildi")
    score -= 0.2
  }

  // 6. Title quality check
  if (title.includes(":") || title.includes("-")) {
    reasons.push("Başlık yapılandırılmış")
    score += 0.1
  }

  // Normalize score to 0-1 range
  score = Math.max(0, Math.min(1, score))

  // Decision
  const passed = score >= config.minQualityScore
  const shouldProcess = passed

  if (passed) {
    reasons.push(`✅ Kalite skoru yeterli (${score.toFixed(2)} >= ${config.minQualityScore})`)
  } else {
    reasons.push(`❌ Kalite skoru yetersiz (${score.toFixed(2)} < ${config.minQualityScore})`)
  }

  return {
    passed,
    score,
    reasons,
    shouldProcess,
  }
}

/**
 * Filter RSS items by quality
 */
export function filterByQuality<T extends { title: string; description?: string | null; content?: string }>(
  items: T[],
  config: QualityFilterConfig = DEFAULT_CONFIG
): Array<{
  item: T
  qualityResult: QualityFilterResult
}> {
  console.error(`[Quality Filter] Filtering ${items.length} items`)

  const results = items.map((item) => ({
    item,
    qualityResult: calculateQualityScore(item, config),
  }))

  const passed = results.filter((r) => r.qualityResult.passed)
  const failed = results.filter((r) => !r.qualityResult.passed)

  console.error(
    `[Quality Filter] Results: ${passed.length} passed, ${failed.length} failed`
  )

  // Sort by quality score (descending)
  passed.sort((a, b) => b.qualityResult.score - a.qualityResult.score)

  // Limit to max articles per day
  const limited = passed.slice(0, config.maxArticlesPerDay)

  if (limited.length < passed.length) {
    console.error(
      `[Quality Filter] Limited to ${config.maxArticlesPerDay} articles (from ${passed.length})`
    )
  }

  return limited
}

/**
 * Get quality filter configuration from environment
 */
export function getQualityFilterConfig(): QualityFilterConfig {
  return {
    minTitleLength: parseInt(process.env.QUALITY_MIN_TITLE_LENGTH || "20"),
    minContentLength: parseInt(process.env.QUALITY_MIN_CONTENT_LENGTH || "200"),
    maxArticlesPerDay: parseInt(process.env.QUALITY_MAX_ARTICLES_PER_DAY || "30"),
    minQualityScore: parseFloat(process.env.QUALITY_MIN_SCORE || "0.7"),
    priorityKeywords: DEFAULT_CONFIG.priorityKeywords,
    excludeKeywords: DEFAULT_CONFIG.excludeKeywords,
    diversityWindow: parseInt(process.env.QUALITY_DIVERSITY_WINDOW || "24"),
  }
}
