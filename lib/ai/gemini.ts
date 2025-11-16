import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini API
const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables")
}

const genAI = new GoogleGenerativeAI(apiKey)

// Model configuration
const modelConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
}

/**
 * Generate text using Gemini AI
 */
export async function generateText(prompt: string, options?: {
  temperature?: number
  maxTokens?: number
  retries?: number
}): Promise<string> {
  const maxRetries = options?.retries ?? 2
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-pro",  // Using Gemini 2.5 Pro (Free Tier)
        generationConfig: {
          temperature: options?.temperature ?? modelConfig.temperature,
          topP: modelConfig.topP,
          topK: modelConfig.topK,
          maxOutputTokens: options?.maxTokens ?? modelConfig.maxOutputTokens,
        },
      })

      const result = await model.generateContent(prompt)
      const response = result.response
      return response.text()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      console.error(`Error generating text (attempt ${attempt + 1}/${maxRetries + 1}):`, error)
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Failed to generate text with Gemini AI after ${maxRetries + 1} attempts: ${lastError?.message}`)
}

/**
 * Summarize content using Gemini AI
 */
export async function summarizeContent(content: string, options?: {
  maxLength?: number
  style?: "brief" | "detailed"
}): Promise<string> {
  const style = options?.style ?? "brief"
  const maxLength = options?.maxLength ?? 200

  const prompt = `
Aşağıdaki haberi Türkçe olarak özetle. ${style === "brief" ? "Kısa ve öz" : "Detaylı"} bir özet yaz.
Özet maksimum ${maxLength} kelime olmalı.

Haber İçeriği:
${content}

Özet:
`.trim()

  return await generateText(prompt, { temperature: 0.5 })
}

/**
 * Generate tags for content using Gemini AI
 */
export async function generateTags(content: string, options?: {
  maxTags?: number
  existingTags?: string[]
}): Promise<string[]> {
  const maxTags = options?.maxTags ?? 5
  const existingTags = options?.existingTags ?? []

  const prompt = `
Aşağıdaki haber içeriği için en uygun ${maxTags} adet etiket (tag) öner.
Etiketler kısa, açıklayıcı ve SEO dostu olmalı.
${existingTags.length > 0 ? `Mevcut etiketler: ${existingTags.join(", ")}` : ""}

Sadece etiketleri virgülle ayrılmış liste olarak ver, başka açıklama ekleme.

Haber İçeriği:
${content}

Etiketler:
`.trim()

  const response = await generateText(prompt, { temperature: 0.6 })
  
  // Parse comma-separated tags
  const tags = response
    .split(",")
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .slice(0, maxTags)

  return tags
}

/**
 * Generate SEO-friendly title
 */
export async function generateSeoTitle(content: string, originalTitle?: string): Promise<string> {
  const prompt = `
Aşağıdaki haber içeriği için SEO dostu, dikkat çekici bir başlık oluştur.
${originalTitle ? `Orijinal başlık: ${originalTitle}` : ""}

Başlık:
- Maksimum 60 karakter olmalı
- Anahtar kelimeleri içermeli
- Tıklanmayı teşvik etmeli
- Türkçe dilbilgisi kurallarına uygun olmalı

Sadece başlığı ver, başka açıklama ekleme.

Haber İçeriği:
${content.substring(0, 500)}...

Başlık:
`.trim()

  return await generateText(prompt, { temperature: 0.7 })
}

/**
 * Generate meta description for SEO
 */
export async function generateMetaDescription(content: string): Promise<string> {
  const prompt = `
Aşağıdaki haber içeriği için SEO dostu bir meta açıklama (meta description) yaz.

Meta açıklama:
- 150-160 karakter arası olmalı
- İçeriği özetlemeli
- Anahtar kelimeleri içermeli
- Okuyucuyu tıklamaya teşvik etmeli

Sadece meta açıklamayı ver, başka açıklama ekleme.

Haber İçeriği:
${content.substring(0, 500)}...

Meta Açıklama:
`.trim()

  return await generateText(prompt, { temperature: 0.6 })
}

/**
 * Analyze content quality
 */
export async function analyzeQuality(content: string): Promise<{
  score: number
  reasons: string[]
  suggestions: string[]
}> {
  const prompt = `
Aşağıdaki haber içeriğinin kalitesini analiz et ve 0-1 arası bir skor ver.

Değerlendirme kriterleri:
- İçerik özgünlüğü ve derinliği
- Dilbilgisi ve yazım kurallarına uygunluk
- Bilgi doğruluğu ve kaynak güvenilirliği
- Okuyucu için değer
- SEO uygunluğu

JSON formatında yanıt ver:
{
  "score": 0.85,
  "reasons": ["İçerik özgün ve detaylı", "Dilbilgisi kurallarına uygun"],
  "suggestions": ["Daha fazla kaynak eklenebilir", "Başlık daha çekici olabilir"]
}

Haber İçeriği:
${content.substring(0, 1000)}...

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.3 })
  
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    
    const analysis = JSON.parse(jsonMatch[0])
    
    return {
      score: Math.max(0, Math.min(1, analysis.score ?? 0.5)),
      reasons: Array.isArray(analysis.reasons) ? analysis.reasons : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
    }
  } catch (error) {
    console.error("Error parsing quality analysis:", error)
    return {
      score: 0.5,
      reasons: ["Analiz yapılamadı"],
      suggestions: ["İçeriği manuel olarak gözden geçirin"],
    }
  }
}

/**
 * Rewrite content in a different style
 */
export async function rewriteContent(
  content: string,
  style: "formal" | "casual" | "news" | "blog" = "news"
): Promise<string> {
  const styleDescriptions = {
    formal: "resmi ve akademik bir dil",
    casual: "günlük ve samimi bir dil",
    news: "haber formatında objektif bir dil",
    blog: "blog yazısı tarzında kişisel bir dil",
  }

  const prompt = `
Aşağıdaki içeriği ${styleDescriptions[style]} kullanarak yeniden yaz.

Orijinal içeriğin ana fikrini ve önemli detayları koru.
Türkçe dilbilgisi kurallarına dikkat et.

Orijinal İçerik:
${content}

Yeniden Yazılmış İçerik:
`.trim()

  return await generateText(prompt, { temperature: 0.8 })
}

/**
 * Extract keywords from content
 */
export async function extractKeywords(content: string, maxKeywords: number = 10): Promise<string[]> {
  const prompt = `
Aşağıdaki haber içeriğinden en önemli ${maxKeywords} anahtar kelimeyi çıkar.

Anahtar kelimeler:
- Tek kelime veya kısa ifadeler olmalı
- İçeriğin ana konularını temsil etmeli
- SEO için uygun olmalı

Sadece anahtar kelimeleri virgülle ayrılmış liste olarak ver.

Haber İçeriği:
${content}

Anahtar Kelimeler:
`.trim()

  const response = await generateText(prompt, { temperature: 0.4 })
  
  const keywords = response
    .split(",")
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0)
    .slice(0, maxKeywords)

  return keywords
}

/**
 * Detect content category
 */
export async function detectCategory(
  content: string,
  availableCategories: string[]
): Promise<string | null> {
  const prompt = `
Aşağıdaki haber içeriği için en uygun kategoriyi seç.

Mevcut kategoriler:
${availableCategories.join(", ")}

Sadece kategori adını ver, başka açıklama ekleme.
Eğer hiçbir kategori uygun değilse "Diğer" yaz.

Haber İçeriği:
${content.substring(0, 500)}...

Kategori:
`.trim()

  const response = await generateText(prompt, { temperature: 0.3 })
  const category = response.trim()

  if (availableCategories.includes(category)) {
    return category
  }

  return null
}

/**
 * Check if content is spam or low quality
 */
export async function isSpam(content: string): Promise<boolean> {
  const prompt = `
Aşağıdaki içeriğin spam, düşük kaliteli veya uygunsuz olup olmadığını kontrol et.

Spam göstergeleri:
- Aşırı reklam içeriği
- Yanıltıcı başlık (clickbait)
- Kötü amaçlı linkler
- Anlamsız veya tekrarlayan içerik
- Uygunsuz dil

Sadece "SPAM" veya "OK" yaz.

İçerik:
${content.substring(0, 500)}...

Sonuç:
`.trim()

  const response = await generateText(prompt, { temperature: 0.1 })
  return response.trim().toUpperCase() === "SPAM"
}
