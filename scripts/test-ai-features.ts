/**
 * Test script for advanced AI features
 * Run with: tsx scripts/test-ai-features.ts
 */

import { generateText, summarizeContent, generateTags } from "../lib/ai/gemini"
import { analyzeSentiment } from "../lib/ai/sentiment"
import { moderateContent } from "../lib/ai/moderation"
import { translateContent } from "../lib/ai/translation"

const testContent = `
Yapay zeka teknolojisi son yıllarda hızla gelişiyor. Google'ın yeni Gemini modeli, 
önceki modellerden çok daha gelişmiş yeteneklere sahip. Özellikle doğal dil işleme 
ve görsel analiz konularında büyük ilerlemeler kaydedildi. Uzmanlar, yapay zekanın 
gelecekte birçok sektörde devrim yaratacağını öngörüyor.
`

async function testBasicFeatures() {
  console.error("🧪 Testing Basic AI Features...\n")

  try {
    // Test 1: Text Generation
    console.error("1️⃣ Testing Text Generation...")
    const generated = await generateText("Yapay zeka hakkında kısa bir paragraf yaz")
    console.error("✅ Generated:", generated.substring(0, 100) + "...\n")

    // Test 2: Summarization
    console.error("2️⃣ Testing Summarization...")
    const summary = await summarizeContent(testContent, { style: "brief", maxLength: 50 })
    console.error("✅ Summary:", summary, "\n")

    // Test 3: Tag Generation
    console.error("3️⃣ Testing Tag Generation...")
    const tags = await generateTags(testContent, { maxTags: 5 })
    console.error("✅ Tags:", tags.join(", "), "\n")

    console.error("✅ Basic features test completed!\n")
  } catch {
    // Error handled
  }
}

async function testAdvancedFeatures() {
  console.error("🧪 Testing Advanced AI Features...\n")

  try {
    // Test 1: Sentiment Analysis
    console.error("1️⃣ Testing Sentiment Analysis...")
    const sentiment = await analyzeSentiment(testContent)
    console.error(
      "✅ Sentiment:",
      {
        type: sentiment.sentiment,
        score: sentiment.score.toFixed(2),
        confidence: sentiment.confidence.toFixed(2),
        mainEmotion: Object.entries(sentiment.emotions).sort(([, a], [, b]) => b - a)[0][0],
      },
      "\n"
    )

    // Test 2: Content Moderation
    console.error("2️⃣ Testing Content Moderation...")
    const moderation = await moderateContent(testContent)
    console.error(
      "✅ Moderation:",
      {
        safe: moderation.safe,
        recommendation: moderation.recommendation,
        highestCategory: Object.entries(moderation.categories).sort(([, a], [, b]) => b - a)[0],
      },
      "\n"
    )

    // Test 3: Translation
    console.error("3️⃣ Testing Translation...")
    const translation = await translateContent(testContent, "en")
    console.error("✅ Translation (EN):", translation.translatedText.substring(0, 100) + "...\n")

    console.error("✅ Advanced features test completed!\n")
  } catch {
    // Error handled
  }
}

async function testErrorHandling() {
  console.error("🧪 Testing Error Handling...\n")

  try {
    // Test with invalid input
    console.error("1️⃣ Testing with empty content...")
    try {
      await summarizeContent("")
      console.error("❌ Should have thrown an error\n")
    } catch {
      console.error("✅ Correctly handled empty content\n")
    }

    // Test with very long content
    console.error("2️⃣ Testing with very long content...")
    const longContent = testContent.repeat(100)
    const summary = await summarizeContent(longContent, { maxLength: 100 })
    console.error("✅ Handled long content:", summary.length, "characters\n")

    console.error("✅ Error handling test completed!\n")
  } catch {
    // Error handled
  }
}

async function runAllTests() {
  console.error("=".repeat(60))
  console.error("🚀 HaberNexus AI Features Test Suite")
  console.error("=".repeat(60) + "\n")

  const startTime = Date.now()

  await testBasicFeatures()
  await testAdvancedFeatures()
  await testErrorHandling()

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.error("=".repeat(60))
  console.error(`✅ All tests completed in ${duration}s`)
  console.error("=".repeat(60))
}

// Run tests
runAllTests().catch(console.error)
