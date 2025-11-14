import { generateText } from "./gemini"

export interface SentimentAnalysis {
  sentiment: "positive" | "negative" | "neutral"
  score: number // -1 to 1
  confidence: number // 0 to 1
  emotions: {
    joy: number
    anger: number
    sadness: number
    fear: number
    surprise: number
    trust: number
  }
  tone: string[]
}

/**
 * Analyze sentiment and emotions in content
 */
export async function analyzeSentiment(content: string): Promise<SentimentAnalysis> {
  const prompt = `
Aşağıdaki haber içeriğinin duygusal tonunu ve hissiyatını analiz et.

JSON formatında yanıt ver:
{
  "sentiment": "positive/negative/neutral",
  "score": 0.65,
  "confidence": 0.85,
  "emotions": {
    "joy": 0.3,
    "anger": 0.1,
    "sadness": 0.2,
    "fear": 0.15,
    "surprise": 0.15,
    "trust": 0.1
  },
  "tone": ["bilgilendirici", "iyimser", "ciddi"]
}

Açıklamalar:
- sentiment: Genel duygu (positive/negative/neutral)
- score: -1 (çok negatif) ile 1 (çok pozitif) arası
- confidence: Analiz güvenilirliği (0-1)
- emotions: Her duygu için 0-1 arası yoğunluk (toplamı 1 olmalı)
- tone: İçeriğin genel tonunu tanımlayan kelimeler

Sadece JSON yanıtı ver, başka açıklama ekleme.

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

    const analysis = JSON.parse(jsonMatch[0])

    return {
      sentiment: analysis.sentiment || "neutral",
      score: Math.max(-1, Math.min(1, analysis.score ?? 0)),
      confidence: Math.max(0, Math.min(1, analysis.confidence ?? 0.5)),
      emotions: {
        joy: analysis.emotions?.joy ?? 0,
        anger: analysis.emotions?.anger ?? 0,
        sadness: analysis.emotions?.sadness ?? 0,
        fear: analysis.emotions?.fear ?? 0,
        surprise: analysis.emotions?.surprise ?? 0,
        trust: analysis.emotions?.trust ?? 0,
      },
      tone: Array.isArray(analysis.tone) ? analysis.tone : [],
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return {
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
    }
  }
}

/**
 * Analyze sentiment of multiple articles for trend detection
 */
export async function analyzeSentimentTrend(
  articles: Array<{ title: string; content: string; publishedAt: Date }>
): Promise<{
  overallSentiment: "positive" | "negative" | "neutral"
  trend: "improving" | "declining" | "stable"
  averageScore: number
  timeline: Array<{ date: string; score: number }>
}> {
  const sentiments = await Promise.all(
    articles.map(async (article) => {
      const sentiment = await analyzeSentiment(article.content)
      return {
        date: article.publishedAt.toISOString().split("T")[0],
        score: sentiment.score,
      }
    })
  )

  // Calculate average
  const averageScore =
    sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length

  // Determine overall sentiment
  let overallSentiment: "positive" | "negative" | "neutral"
  if (averageScore > 0.2) {
    overallSentiment = "positive"
  } else if (averageScore < -0.2) {
    overallSentiment = "negative"
  } else {
    overallSentiment = "neutral"
  }

  // Determine trend
  let trend: "improving" | "declining" | "stable"
  if (sentiments.length >= 2) {
    const firstHalf = sentiments
      .slice(0, Math.floor(sentiments.length / 2))
      .reduce((sum, s) => sum + s.score, 0) / Math.floor(sentiments.length / 2)
    const secondHalf = sentiments
      .slice(Math.floor(sentiments.length / 2))
      .reduce((sum, s) => sum + s.score, 0) /
      (sentiments.length - Math.floor(sentiments.length / 2))

    if (secondHalf - firstHalf > 0.1) {
      trend = "improving"
    } else if (firstHalf - secondHalf > 0.1) {
      trend = "declining"
    } else {
      trend = "stable"
    }
  } else {
    trend = "stable"
  }

  return {
    overallSentiment,
    trend,
    averageScore,
    timeline: sentiments,
  }
}

/**
 * Suggest content tone adjustments
 */
export async function suggestToneAdjustments(
  content: string,
  targetTone: "formal" | "casual" | "optimistic" | "neutral" | "serious"
): Promise<string> {
  const toneDescriptions = {
    formal: "resmi, akademik ve profesyonel",
    casual: "günlük, samimi ve rahat",
    optimistic: "iyimser, umut verici ve pozitif",
    neutral: "tarafsız, objektif ve dengeli",
    serious: "ciddi, ağırbaşlı ve dikkatli",
  }

  const prompt = `
Aşağıdaki içeriğin tonunu ${toneDescriptions[targetTone]} bir tona dönüştür.

Ana fikir ve bilgileri koru, sadece tonunu değiştir.
Türkçe dilbilgisi kurallarına dikkat et.

Orijinal İçerik:
${content}

Düzenlenmiş İçerik:
`.trim()

  return await generateText(prompt, { temperature: 0.7 })
}
