/**
 * Test script for duplicate checker
 */

import "dotenv/config"
import {
  checkDuplicate,
  generateTitleHash,
  generateContentHash,
  calculateSimilarity,
} from "../lib/services/duplicate-checker"

async function testDuplicateChecker() {
  console.log("=".repeat(60))
  console.log("DUPLICATE CHECKER TEST")
  console.log("=".repeat(60))

  // Test 1: Hash generation
  console.log("\n1. Testing hash generation...")
  const title1 = "Kış Aylarında Artan Yorgunluk ve Mutsuzluk"
  const title2 = "Kış aylarında artan yorgunluk ve mutsuzluk!"
  const title3 = "Yazın Artan Enerji ve Mutluluk"

  const hash1 = generateTitleHash(title1)
  const hash2 = generateTitleHash(title2)
  const hash3 = generateTitleHash(title3)

  console.log(`Title 1: "${title1}"`)
  console.log(`Hash 1:  ${hash1}`)
  console.log(`\nTitle 2: "${title2}"`)
  console.log(`Hash 2:  ${hash2}`)
  console.log(`\nSame hash? ${hash1 === hash2 ? "✅ YES" : "❌ NO"}`)
  console.log(`\nTitle 3: "${title3}"`)
  console.log(`Hash 3:  ${hash3}`)
  console.log(`Different hash? ${hash1 !== hash3 ? "✅ YES" : "❌ NO"}`)

  // Test 2: Similarity calculation
  console.log("\n\n2. Testing similarity calculation...")
  const sim1 = calculateSimilarity(title1, title2)
  const sim2 = calculateSimilarity(title1, title3)

  console.log(`Similarity (title1 vs title2): ${(sim1 * 100).toFixed(1)}%`)
  console.log(`Similarity (title1 vs title3): ${(sim2 * 100).toFixed(1)}%`)

  // Test 3: Duplicate check (will fail if no database connection)
  console.log("\n\n3. Testing duplicate check...")
  try {
    const result = await checkDuplicate(
      "Test Article Title - " + Date.now(),
      "This is a test article content for duplicate checking.",
      {
        rssGuid: "test-guid-" + Date.now(),
        rssFeedId: "test-feed-id",
      }
    )

    console.log(`Duplicate found? ${result.isDuplicate ? "❌ YES" : "✅ NO"}`)
    if (result.isDuplicate) {
      console.log(`Reason: ${result.reason}`)
      console.log(`Existing article: ${result.existingArticle?.title}`)
    }
  } catch (error) {
    console.error(`❌ Database check failed:`, error instanceof Error ? error.message : error)
  }

  // Test 4: Content hash
  console.log("\n\n4. Testing content hash...")
  const content1 = "Bu bir test içeriğidir. Kış aylarında sağlıklı yaşam önerileri."
  const content2 = "bu bir test içeriğidir kış aylarında sağlıklı yaşam önerileri"
  const content3 = "Tamamen farklı bir içerik."

  const contentHash1 = generateContentHash(content1)
  const contentHash2 = generateContentHash(content2)
  const contentHash3 = generateContentHash(content3)

  console.log(`Content 1: "${content1}"`)
  console.log(`Hash 1:    ${contentHash1.substring(0, 32)}...`)
  console.log(`\nContent 2: "${content2}"`)
  console.log(`Hash 2:    ${contentHash2.substring(0, 32)}...`)
  console.log(`\nSame hash? ${contentHash1 === contentHash2 ? "✅ YES" : "❌ NO"}`)
  console.log(`\nContent 3: "${content3}"`)
  console.log(`Hash 3:    ${contentHash3.substring(0, 32)}...`)
  console.log(`Different hash? ${contentHash1 !== contentHash3 ? "✅ YES" : "❌ NO"}`)

  console.log("\n" + "=".repeat(60))
  console.log("TEST COMPLETED")
  console.log("=".repeat(60))
}

testDuplicateChecker()
  .then(() => {
    console.log("\n✅ All tests completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error)
    process.exit(1)
  })
