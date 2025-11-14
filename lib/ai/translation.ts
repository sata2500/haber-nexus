import { generateText } from "./gemini"

export type SupportedLanguage = "en" | "de" | "fr" | "es" | "ar" | "ru" | "zh" | "ja" | "tr"

const languageNames: Record<SupportedLanguage, { native: string; turkish: string }> = {
  tr: { native: "Türkçe", turkish: "Türkçe" },
  en: { native: "English", turkish: "İngilizce" },
  de: { native: "Deutsch", turkish: "Almanca" },
  fr: { native: "Français", turkish: "Fransızca" },
  es: { native: "Español", turkish: "İspanyolca" },
  ar: { native: "العربية", turkish: "Arapça" },
  ru: { native: "Русский", turkish: "Rusça" },
  zh: { native: "中文", turkish: "Çince" },
  ja: { native: "日本語", turkish: "Japonca" },
}

export interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLang: SupportedLanguage
  targetLang: SupportedLanguage
  confidence: number
}

/**
 * Translate content to target language
 */
export async function translateContent(
  content: string,
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = "tr"
): Promise<TranslationResult> {
  const prompt = `
Aşağıdaki ${languageNames[sourceLang].turkish} metni ${languageNames[targetLang].turkish} (${languageNames[targetLang].native}) diline çevir.

Çeviri kuralları:
- Doğal ve akıcı bir dil kullan
- Kaynak metnin tonunu ve stilini koru
- Kültürel bağlamı dikkate al
- Teknik terimleri doğru çevir
- Başlıkları ve özel isimleri uygun şekilde çevir

Sadece çeviriyi ver, başka açıklama ekleme.

Kaynak Metin:
${content}

Çeviri:
`.trim()

  try {
    const translatedText = await generateText(prompt, { temperature: 0.3 })

    return {
      originalText: content,
      translatedText: translatedText.trim(),
      sourceLang,
      targetLang,
      confidence: 0.85, // Gemini generally provides good translations
    }
  } catch (error) {
    console.error("Error translating content:", error)
    throw new Error("Failed to translate content")
  }
}

/**
 * Translate article with metadata
 */
export async function translateArticle(
  article: {
    title: string
    excerpt: string
    content: string
    metaTitle?: string
    metaDescription?: string
  },
  targetLang: SupportedLanguage
): Promise<{
  title: string
  excerpt: string
  content: string
  metaTitle: string
  metaDescription: string
}> {
  const [title, excerpt, content, metaTitle, metaDescription] = await Promise.all([
    translateContent(article.title, targetLang),
    translateContent(article.excerpt, targetLang),
    translateContent(article.content, targetLang),
    article.metaTitle
      ? translateContent(article.metaTitle, targetLang)
      : translateContent(article.title, targetLang),
    article.metaDescription
      ? translateContent(article.metaDescription, targetLang)
      : translateContent(article.excerpt, targetLang),
  ])

  return {
    title: title.translatedText,
    excerpt: excerpt.translatedText,
    content: content.translatedText,
    metaTitle: metaTitle.translatedText,
    metaDescription: metaDescription.translatedText,
  }
}

/**
 * Detect language of content
 */
export async function detectLanguage(content: string): Promise<{
  language: SupportedLanguage
  confidence: number
}> {
  const prompt = `
Aşağıdaki metnin dilini tespit et.

Desteklenen diller:
${Object.entries(languageNames)
  .map(([code, names]) => `- ${code}: ${names.native} (${names.turkish})`)
  .join("\n")}

JSON formatında yanıt ver:
{
  "language": "tr",
  "confidence": 0.95
}

Sadece JSON yanıtı ver, başka açıklama ekleme.

Metin:
${content.substring(0, 500)}...

Analiz:
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.1 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      language: result.language || "tr",
      confidence: Math.max(0, Math.min(1, result.confidence ?? 0.5)),
    }
  } catch (error) {
    console.error("Error detecting language:", error)
    return {
      language: "tr",
      confidence: 0,
    }
  }
}

/**
 * Translate multiple texts in batch
 */
export async function batchTranslate(
  texts: string[],
  targetLang: SupportedLanguage,
  sourceLang: SupportedLanguage = "tr"
): Promise<TranslationResult[]> {
  const results: TranslationResult[] = []

  for (const text of texts) {
    try {
      const result = await translateContent(text, targetLang, sourceLang)
      results.push(result)
    } catch (error) {
      console.error(`Error translating text: ${text.substring(0, 50)}...`, error)
      results.push({
        originalText: text,
        translatedText: text, // Fallback to original
        sourceLang,
        targetLang,
        confidence: 0,
      })
    }
  }

  return results
}

/**
 * Get available translations for an article
 */
export function getAvailableLanguages(): Array<{
  code: SupportedLanguage
  name: string
  nativeName: string
}> {
  return Object.entries(languageNames).map(([code, names]) => ({
    code: code as SupportedLanguage,
    name: names.turkish,
    nativeName: names.native,
  }))
}

/**
 * Improve translation quality with context
 */
export async function improveTranslation(
  originalText: string,
  translatedText: string,
  targetLang: SupportedLanguage,
  context?: string
): Promise<string> {
  const prompt = `
Aşağıdaki çeviriyi iyileştir ve daha doğal hale getir.

Orijinal Metin (Türkçe):
${originalText}

Mevcut Çeviri (${languageNames[targetLang].turkish}):
${translatedText}

${context ? `Bağlam: ${context}` : ""}

İyileştirme kriterleri:
- Daha doğal ve akıcı ifadeler kullan
- Kültürel uygunluğu artır
- Teknik terimleri kontrol et
- Tonun tutarlılığını sağla

Sadece iyileştirilmiş çeviriyi ver, başka açıklama ekleme.

İyileştirilmiş Çeviri:
`.trim()

  try {
    const improved = await generateText(prompt, { temperature: 0.4 })
    return improved.trim()
  } catch (error) {
    console.error("Error improving translation:", error)
    return translatedText // Return original translation on error
  }
}
