import { generateText } from "./gemini"

export interface ModerationResult {
  safe: boolean
  categories: {
    hate: number
    violence: number
    sexual: number
    selfHarm: number
    spam: number
    misinformation: number
    harassment: number
  }
  flaggedPhrases: string[]
  recommendation: "approve" | "review" | "reject"
  reason?: string
}

/**
 * Moderate content for safety and appropriateness
 */
export async function moderateContent(content: string): Promise<ModerationResult> {
  const prompt = `
Aşağıdaki içeriği moderasyon açısından değerlendir.

Kategoriler ve skorlar (0-1 arası):
- hate: Nefret söylemi, ayrımcılık
- violence: Şiddet içeriği, tehdit
- sexual: Cinsel içerik, uygunsuzluk
- selfHarm: Kendine zarar, intihar
- spam: Spam, reklam, clickbait
- misinformation: Yanlış bilgi, dezenformasyon
- harassment: Taciz, zorbalık

JSON formatında yanıt ver:
{
  "safe": true,
  "categories": {
    "hate": 0.1,
    "violence": 0.05,
    "sexual": 0.0,
    "selfHarm": 0.0,
    "spam": 0.2,
    "misinformation": 0.1,
    "harassment": 0.0
  },
  "flaggedPhrases": [],
  "recommendation": "approve",
  "reason": ""
}

Açıklamalar:
- safe: Herhangi bir kategori 0.5'in üzerindeyse false
- flaggedPhrases: Sorunlu ifadeler (varsa)
- recommendation: approve (güvenli), review (incelenmeli), reject (reddedilmeli)
- reason: Recommendation için açıklama

Sadece JSON yanıtı ver, başka açıklama ekleme.

İçerik:
${content.substring(0, 2000)}...

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
      safe: result.safe ?? true,
      categories: {
        hate: Math.max(0, Math.min(1, result.categories?.hate ?? 0)),
        violence: Math.max(0, Math.min(1, result.categories?.violence ?? 0)),
        sexual: Math.max(0, Math.min(1, result.categories?.sexual ?? 0)),
        selfHarm: Math.max(0, Math.min(1, result.categories?.selfHarm ?? 0)),
        spam: Math.max(0, Math.min(1, result.categories?.spam ?? 0)),
        misinformation: Math.max(0, Math.min(1, result.categories?.misinformation ?? 0)),
        harassment: Math.max(0, Math.min(1, result.categories?.harassment ?? 0)),
      },
      flaggedPhrases: Array.isArray(result.flaggedPhrases) ? result.flaggedPhrases : [],
      recommendation: result.recommendation || "review",
      reason: result.reason,
    }
  } catch {
    // Error handled
    // Default to review on error
    return {
      safe: false,
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
      recommendation: "review",
      reason: "Moderation analysis failed",
    }
  }
}

/**
 * Moderate user comment
 */
export async function moderateComment(comment: string): Promise<{
  approved: boolean
  reason?: string
  suggestedEdit?: string
}> {
  const moderation = await moderateContent(comment)

  if (moderation.safe && moderation.recommendation === "approve") {
    return { approved: true }
  }

  if (moderation.recommendation === "reject") {
    return {
      approved: false,
      reason: moderation.reason || "İçerik topluluk kurallarına uygun değil",
    }
  }

  // Try to suggest an edit
  const prompt = `
Aşağıdaki yorum uygunsuz içerik barındırıyor.
Uygunsuz kısımları kaldırarak veya düzelterek daha uygun bir versiyonunu yaz.

Orijinal Yorum:
${comment}

Sorunlar:
${moderation.flaggedPhrases.join(", ")}

Düzeltilmiş Yorum:
`.trim()

  try {
    const suggestedEdit = await generateText(prompt, { temperature: 0.5 })

    return {
      approved: false,
      reason: moderation.reason,
      suggestedEdit: suggestedEdit.trim(),
    }
  } catch {
    return {
      approved: false,
      reason: moderation.reason,
    }
  }
}

/**
 * Check for misinformation and provide fact-check
 */
export async function checkFactAccuracy(content: string): Promise<{
  reliable: boolean
  confidence: number
  claims: Array<{
    claim: string
    verdict: "verified" | "unverified" | "false"
    confidence: number
    explanation: string
  }>
  overallScore: number
}> {
  const prompt = `
Aşağıdaki haber içeriğindeki önemli iddiaları tespit et ve doğruluklarını değerlendir.

JSON formatında yanıt ver:
{
  "reliable": true,
  "confidence": 0.75,
  "claims": [
    {
      "claim": "İddia metni",
      "verdict": "verified",
      "confidence": 0.85,
      "explanation": "Bu iddia genel olarak doğru kabul edilir çünkü..."
    }
  ],
  "overallScore": 0.75
}

Açıklamalar:
- reliable: İçerik genel olarak güvenilir mi?
- confidence: Analizin güvenilirliği (0-1)
- claims: Tespit edilen önemli iddialar
- verdict: verified (doğrulanmış), unverified (doğrulanmamış), false (yanlış)
- overallScore: Genel güvenilirlik skoru (0-1)

Sadece JSON yanıtı ver, başka açıklama ekleme.

Haber İçeriği:
${content.substring(0, 2000)}...

Analiz:
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.2 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      reliable: result.reliable ?? true,
      confidence: Math.max(0, Math.min(1, result.confidence ?? 0.5)),
      claims: Array.isArray(result.claims)
        ? result.claims.map((claim: { claim?: string; verdict?: string; confidence?: number; explanation?: string }) => ({
            claim: claim.claim || "",
            verdict: claim.verdict || "unverified",
            confidence: Math.max(0, Math.min(1, claim.confidence ?? 0.5)),
            explanation: claim.explanation || "",
          }))
        : [],
      overallScore: Math.max(0, Math.min(1, result.overallScore ?? 0.5)),
    }
  } catch {
    // Error handled
    return {
      reliable: true,
      confidence: 0,
      claims: [],
      overallScore: 0.5,
    }
  }
}

/**
 * Detect potential plagiarism or duplicate content
 */
export async function detectPlagiarism(
  content: string,
  sourceUrl?: string
): Promise<{
  isPlagiarized: boolean
  confidence: number
  similarPhrases: string[]
  recommendation: string
}> {
  const prompt = `
Aşağıdaki içeriği analiz et ve potansiyel kopya/intihal belirtilerini tespit et.

Kontrol kriterleri:
- Çok genel/jenerik ifadeler
- Kaynak belirtilmemiş alıntılar
- Tutarsız yazım stili
- Profesyonel olmayan kopyala-yapıştır belirtileri

JSON formatında yanıt ver:
{
  "isPlagiarized": false,
  "confidence": 0.3,
  "similarPhrases": [],
  "recommendation": "İçerik özgün görünüyor"
}

Sadece JSON yanıtı ver, başka açıklama ekleme.

${sourceUrl ? `Kaynak URL: ${sourceUrl}` : ""}

İçerik:
${content.substring(0, 2000)}...

Analiz:
`.trim()

  try {
    const response = await generateText(prompt, { temperature: 0.2 })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }

    const result = JSON.parse(jsonMatch[0])

    return {
      isPlagiarized: result.isPlagiarized ?? false,
      confidence: Math.max(0, Math.min(1, result.confidence ?? 0)),
      similarPhrases: Array.isArray(result.similarPhrases) ? result.similarPhrases : [],
      recommendation: result.recommendation || "",
    }
  } catch {
    // Error handled
    return {
      isPlagiarized: false,
      confidence: 0,
      similarPhrases: [],
      recommendation: "Plagiarism check failed",
    }
  }
}
