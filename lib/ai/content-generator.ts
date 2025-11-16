import { generateText } from "./gemini"
import { moderateContent, checkFactAccuracy } from "./moderation"
import { generateTags, extractKeywords, generateSeoTitle, generateMetaDescription } from "./gemini"

export interface ContentGenerationOptions {
  topic: string
  style?: "news" | "blog" | "analysis" | "interview" | "opinion"
  tone?: "formal" | "casual" | "professional" | "friendly"
  length?: "short" | "medium" | "long" // 300-500, 800-1200, 1500-2500 words
  includeResearch?: boolean
  includeSources?: boolean
  targetAudience?: string
  keywords?: string[]
}

export interface GeneratedContent {
  title: string
  slug: string
  excerpt: string
  content: string
  outline: string[]

  // SEO
  metaTitle: string
  metaDescription: string
  keywords: string[]
  tags: string[]

  // Quality
  qualityScore: number
  readabilityScore: number
  seoScore: number

  // Metadata
  wordCount: number
  estimatedReadTime: number // minutes
  sources?: ResearchSource[]

  // AI Metadata
  aiGenerated: true
  aiModel: string
  generatedAt: Date
}

export interface ResearchSource {
  title: string
  url: string
  excerpt: string
  reliability: number
  isUsed: boolean
}

/**
 * Generate complete article from topic
 */
export async function generateArticle(
  options: ContentGenerationOptions
): Promise<GeneratedContent> {
  const {
    topic,
    style = "news",
    tone = "professional",
    length = "medium",
    includeResearch = true,
    includeSources = true,
    targetAudience = "genel okuyucu",
    keywords = [],
  } = options

  console.error("[generateArticle] Starting for topic:", topic)

  // Step 1: Research (if enabled)
  let researchData = ""
  let sources: ResearchSource[] = []

  if (includeResearch) {
    console.error("[generateArticle] Conducting research...")
    const research = await conductResearch(topic)
    researchData = research.summary
    sources = research.sources
    console.error("[generateArticle] Research completed. Sources:", sources.length)
  }

  // Step 2: Create outline
  console.error("[generateArticle] Creating outline...")
  const outline = await createOutline(topic, style, researchData)
  console.error("[generateArticle] Outline created with", outline.length, "items")

  // Step 3: Generate content
  console.error("[generateArticle] Generating content...")
  const content = await generateContentFromOutline(
    topic,
    outline,
    style,
    tone,
    length,
    researchData,
    targetAudience
  )
  console.error("[generateArticle] Content generated. Length:", content.length, "characters")

  // Step 4: Generate title
  const title = await generateSeoTitle(content)

  // Step 5: Generate excerpt
  const excerpt = await generateExcerpt(content)

  // Step 6: Generate SEO metadata
  const metaTitle = await generateSeoTitle(content, title)
  const metaDescription = await generateMetaDescription(content)
  const extractedKeywords = await extractKeywords(content, 10)
  const allKeywords = [...new Set([...keywords, ...extractedKeywords])]

  // Step 7: Generate tags
  const tags = await generateTags(content, { maxTags: 5 })

  // Step 8: Calculate scores
  const qualityScore = await calculateQualityScore(content)
  const readabilityScore = await calculateReadabilityScore(content)
  const seoScore = await calculateSeoScore(content, allKeywords)

  // Step 9: Calculate metadata
  const wordCount = content.split(/\s+/).length
  const estimatedReadTime = Math.ceil(wordCount / 200) // 200 words per minute

  // Step 10: Create slug
  const slug = createSlug(title)

  return {
    title,
    slug,
    excerpt,
    content,
    outline,

    metaTitle,
    metaDescription,
    keywords: allKeywords,
    tags,

    qualityScore,
    readabilityScore,
    seoScore,

    wordCount,
    estimatedReadTime,
    sources: includeSources ? sources : undefined,

    aiGenerated: true,
    aiModel: "gemini-2.5-flash",
    generatedAt: new Date(),
  }
}

/**
 * Conduct research on topic
 */
async function conductResearch(topic: string): Promise<{
  summary: string
  sources: ResearchSource[]
}> {
  const prompt = `
Konu: ${topic}

Bu konu hakkında kapsamlı bir araştırma yap ve aşağıdaki bilgileri topla:

1. Ana noktalar ve önemli bilgiler
2. Güncel gelişmeler ve trendler
3. Farklı perspektifler ve görüşler
4. İstatistikler ve veriler (varsa)
5. Uzman görüşleri

JSON formatında yanıt ver:
{
  "summary": "Araştırma özeti (500-800 kelime)",
  "keyPoints": ["nokta1", "nokta2", ...],
  "statistics": ["istatistik1", "istatistik2", ...],
  "perspectives": ["görüş1", "görüş2", ...],
  "sources": [
    {
      "title": "Kaynak başlığı",
      "url": "https://example.com",
      "excerpt": "Kısa alıntı",
      "reliability": 0.85
    }
  ]
}

Sadece JSON yanıtı ver, başka açıklama ekleme.
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.4 })

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const research = JSON.parse(jsonMatch[0])

    return {
      summary: research.summary || "",
      sources: (research.sources || []).map(
        (s: { title?: string; url?: string; excerpt?: string; reliability?: number }) => ({
          title: s.title || "",
          url: s.url || "",
          excerpt: s.excerpt || "",
          reliability: Math.max(0, Math.min(1, s.reliability ?? 0.5)),
          isUsed: false,
        })
      ),
    }
  } catch (error) {
    console.error("Research error:", error)
    return {
      summary: "",
      sources: [],
    }
  }
}

/**
 * Create article outline
 */
async function createOutline(
  topic: string,
  style: string,
  researchData: string
): Promise<string[]> {
  const prompt = `
Konu: ${topic}
Stil: ${style}

${researchData ? `Araştırma Verileri:\n${researchData.substring(0, 1000)}...\n` : ""}

Bu konu için detaylı bir makale yapısı (outline) oluştur.

${style === "news" ? "Haber formatında: Giriş, Gelişme, Detaylar, Sonuç" : ""}
${style === "blog" ? "Blog formatında: Giriş, Ana Konular, Örnekler, Sonuç" : ""}
${style === "analysis" ? "Analiz formatında: Giriş, Durum Analizi, Değerlendirme, Sonuç" : ""}

JSON formatında yanıt ver:
{
  "outline": [
    "1. Giriş",
    "   - Alt başlık 1",
    "   - Alt başlık 2",
    "2. Ana Konu",
    "   - Alt başlık 1",
    "   - Alt başlık 2",
    "3. Sonuç"
  ]
}

Sadece JSON yanıtı ver.
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.5 })

    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])
    return Array.isArray(result.outline) ? result.outline : []
  } catch (error) {
    console.error("Outline creation error:", error)
    return ["1. Giriş", "2. Ana Konu", "3. Detaylar", "4. Sonuç"]
  }
}

/**
 * Generate content from outline
 */
async function generateContentFromOutline(
  topic: string,
  outline: string[],
  style: string,
  tone: string,
  length: string,
  researchData: string,
  targetAudience: string
): Promise<string> {
  const lengthGuide = {
    short: "300-500 kelime",
    medium: "800-1200 kelime",
    long: "1500-2500 kelime",
  }

  const styleGuide = {
    news: "Objektif, bilgilendirici, haber dili",
    blog: "Kişisel, samimi, hikaye anlatımı",
    analysis: "Derinlemesine, analitik, detaylı",
    interview: "Soru-cevap formatında, diyalog tarzı",
    opinion: "Görüş bildiren, argümanlı, ikna edici",
  }

  const toneGuide = {
    formal: "Resmi, akademik dil",
    casual: "Günlük, rahat dil",
    professional: "Profesyonel, iş dili",
    friendly: "Samimi, sıcak dil",
  }

  const prompt = `
Konu: ${topic}
Hedef Kitle: ${targetAudience}
Stil: ${styleGuide[style as keyof typeof styleGuide]}
Ton: ${toneGuide[tone as keyof typeof toneGuide]}
Uzunluk: ${lengthGuide[length as keyof typeof lengthGuide]}

Makale Yapısı:
${outline.join("\n")}

${researchData ? `Araştırma Verileri:\n${researchData}\n` : ""}

Yukarıdaki yapıya göre özgün, profesyonel ve ilgi çekici bir makale yaz.

Kurallar:
1. Tamamen özgün içerik oluştur
2. Türkçe dilbilgisi kurallarına uygun yaz
3. Akıcı ve okunabilir olsun
4. Paragraflar arası geçişler doğal olsun
5. Başlıkları ve alt başlıkları kullan
6. Örnekler ve açıklamalar ekle
7. Sonuç bölümünde özet ve değerlendirme yap

Makale:
`.trim()

  const content = await generateText(prompt, {
    temperature: 0.7,
    maxTokens: length === "long" ? 8192 : length === "medium" ? 4096 : 2048,
  })

  return content.trim()
}

/**
 * Generate excerpt from content
 */
async function generateExcerpt(content: string): Promise<string> {
  const prompt = `
Aşağıdaki makale için çekici ve bilgilendirici bir özet yaz (150-200 karakter).

Makale:
${content.substring(0, 1000)}...

Özet:
`.trim()

  const excerpt = await generateText(prompt, { temperature: 0.6 })
  return excerpt.trim().substring(0, 200)
}

/**
 * Calculate quality score
 */
async function calculateQualityScore(content: string): Promise<number> {
  try {
    console.error("[Quality] Calculating quality score...")
    const moderation = await moderateContent(content)
    console.error("[Quality] Moderation:", moderation.safe ? "safe" : "unsafe")
    const factCheck = await checkFactAccuracy(content)
    console.error("[Quality] Fact check score:", factCheck.overallScore)

    let score = 0.5

    // Moderation score (40%)
    if (moderation.safe) {
      score += 0.4
    } else {
      score += 0.2
    }

    // Fact check score (30%)
    score += factCheck.overallScore * 0.3

    // Length score (15%)
    const wordCount = content.split(/\s+/).length
    if (wordCount >= 500 && wordCount <= 2500) {
      score += 0.15
    } else if (wordCount >= 300) {
      score += 0.1
    }

    // Structure score (15%)
    const hasParagraphs = content.split("\n\n").length >= 3
    const hasHeadings = /^#+\s/m.test(content) || /^[A-ZÇĞİÖŞÜ\s]+$/m.test(content)
    if (hasParagraphs && hasHeadings) {
      score += 0.15
    } else if (hasParagraphs || hasHeadings) {
      score += 0.1
    }

    const finalScore = Math.max(0, Math.min(1, score))
    console.error("[Quality] Final quality score:", finalScore)
    return finalScore
  } catch (error) {
    console.error("[Quality] Quality score calculation error:", error)
    return 0.5
  }
}

/**
 * Calculate readability score
 */
async function calculateReadabilityScore(content: string): Promise<number> {
  // Simple readability metrics
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const words = content.split(/\s+/)
  const avgWordsPerSentence = words.length / sentences.length

  // Ideal: 15-20 words per sentence
  let score = 50

  if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
    score = 90
  } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
    score = 75
  } else if (avgWordsPerSentence < 10) {
    score = 60 // Too short
  } else {
    score = 50 // Too long
  }

  // Paragraph length check
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0)
  const avgWordsPerParagraph = words.length / paragraphs.length

  if (avgWordsPerParagraph >= 50 && avgWordsPerParagraph <= 150) {
    score += 10
  } else if (avgWordsPerParagraph >= 30 && avgWordsPerParagraph <= 200) {
    score += 5
  }

  return Math.min(100, score)
}

/**
 * Calculate SEO score
 */
async function calculateSeoScore(content: string, keywords: string[]): Promise<number> {
  let score = 0

  // Keyword density (30 points)
  const wordCount = content.split(/\s+/).length
  let keywordCount = 0
  keywords.forEach((keyword) => {
    const regex = new RegExp(keyword, "gi")
    const matches = content.match(regex)
    if (matches) {
      keywordCount += matches.length
    }
  })
  const density = (keywordCount / wordCount) * 100
  if (density >= 1 && density <= 3) {
    score += 30
  } else if (density >= 0.5 && density <= 5) {
    score += 20
  } else if (density > 0) {
    score += 10
  }

  // Content length (20 points)
  if (wordCount >= 800 && wordCount <= 2500) {
    score += 20
  } else if (wordCount >= 500) {
    score += 15
  } else if (wordCount >= 300) {
    score += 10
  }

  // Headings (20 points)
  const hasHeadings = /^#+\s/m.test(content) || /^[A-ZÇĞİÖŞÜ\s]+$/m.test(content)
  if (hasHeadings) {
    score += 20
  }

  // Paragraphs (15 points)
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0)
  if (paragraphs.length >= 3) {
    score += 15
  } else if (paragraphs.length >= 2) {
    score += 10
  }

  // Links potential (15 points) - check for URLs or link indicators
  const hasLinks = /https?:\/\//.test(content) || /\[.*\]\(.*\)/.test(content)
  if (hasLinks) {
    score += 15
  } else {
    score += 5 // Potential for internal links
  }

  return Math.min(100, score)
}

/**
 * Create URL-friendly slug
 */
function createSlug(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  }

  let slug = text.toLowerCase()

  Object.entries(turkishMap).forEach(([turkish, latin]) => {
    slug = slug.replace(new RegExp(turkish, "g"), latin)
  })

  slug = slug
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()

  if (slug.length > 100) {
    slug = slug.substring(0, 100)
    slug = slug.replace(/-$/, "")
  }

  return slug
}

/**
 * Improve existing content
 */
export async function improveContent(content: string, improvements: string[]): Promise<string> {
  const prompt = `
Aşağıdaki içeriği şu iyileştirmelerle yeniden yaz:

İyileştirmeler:
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join("\n")}

Orijinal İçerik:
${content}

İyileştirilmiş İçerik:
`.trim()

  return await generateText(prompt, { temperature: 0.7 })
}

/**
 * Expand outline to full article
 */
export async function expandOutline(
  outline: string[],
  topic: string,
  style: string = "news"
): Promise<string> {
  return await generateContentFromOutline(
    topic,
    outline,
    style,
    "professional",
    "medium",
    "",
    "genel okuyucu"
  )
}
