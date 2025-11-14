import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables")
}

const genAI = new GoogleGenerativeAI(apiKey)

export interface ImageAnalysis {
  description: string
  altText: string
  tags: string[]
  isRelevant: boolean
  qualityScore: number
}

/**
 * Analyze image content using Gemini Vision
 */
export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Fetch image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")

    // Determine mime type
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

    const prompt = `
Bu görseli Türkçe olarak analiz et ve aşağıdaki JSON formatında yanıt ver:

{
  "description": "Görselin detaylı açıklaması (2-3 cümle)",
  "altText": "Erişilebilirlik için kısa alt text (maks 125 karakter)",
  "tags": ["tag1", "tag2", "tag3"],
  "isRelevant": true,
  "qualityScore": 0.85
}

Değerlendirme kriterleri:
- description: Görselde ne var, ne oluyor?
- altText: Görme engelliler için açıklayıcı metin
- tags: Görseli tanımlayan 3-5 anahtar kelime
- isRelevant: Haber içeriği için uygun mu? (reklam, logo vb. değil mi?)
- qualityScore: Görsel kalitesi (0-1 arası)

Sadece JSON yanıtı ver, başka açıklama ekleme.
`.trim()

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: contentType,
        },
      },
      prompt,
    ])

    const response = result.response.text()

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    return {
      description: analysis.description || "",
      altText: analysis.altText || "",
      tags: Array.isArray(analysis.tags) ? analysis.tags : [],
      isRelevant: analysis.isRelevant ?? true,
      qualityScore: Math.max(0, Math.min(1, analysis.qualityScore ?? 0.5)),
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw new Error("Failed to analyze image with Gemini Vision")
  }
}

/**
 * Extract and analyze images from HTML content
 */
export async function extractAndAnalyzeImages(
  htmlContent: string
): Promise<Array<{ url: string; analysis: ImageAnalysis }>> {
  // Extract image URLs from HTML
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const imageUrls: string[] = []
  let match

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    imageUrls.push(match[1])
  }

  // Analyze each image
  const results: Array<{ url: string; analysis: ImageAnalysis }> = []

  for (const url of imageUrls) {
    try {
      // Skip data URLs and very small images
      if (url.startsWith("data:") || url.includes("1x1") || url.includes("pixel")) {
        continue
      }

      const analysis = await analyzeImage(url)

      // Only include relevant and good quality images
      if (analysis.isRelevant && analysis.qualityScore > 0.5) {
        results.push({ url, analysis })
      }
    } catch (error) {
      console.error(`Error analyzing image ${url}:`, error)
      // Continue with next image
    }
  }

  return results
}

/**
 * Select best cover image from analyzed images
 */
export function selectBestCoverImage(
  analyzedImages: Array<{ url: string; analysis: ImageAnalysis }>
): { url: string; analysis: ImageAnalysis } | null {
  if (analyzedImages.length === 0) {
    return null
  }

  // Sort by quality score
  const sorted = [...analyzedImages].sort(
    (a, b) => b.analysis.qualityScore - a.analysis.qualityScore
  )

  return sorted[0]
}

/**
 * Generate image caption for article
 */
export async function generateImageCaption(
  imageUrl: string,
  articleContext: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

    const prompt = `
Makale bağlamı:
${articleContext.substring(0, 300)}...

Bu görseli makale bağlamında açıklayan kısa bir başlık (caption) yaz.
Maksimum 100 karakter, Türkçe, açıklayıcı ve ilgi çekici olmalı.

Sadece başlığı ver, başka açıklama ekleme.
`.trim()

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: contentType,
        },
      },
      prompt,
    ])

    return result.response.text().trim()
  } catch (error) {
    console.error("Error generating image caption:", error)
    return ""
  }
}
