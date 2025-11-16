/**
 * Test script for API Key Manager
 */

import "dotenv/config"
import {
  getNextGoogleApiKey,
  recordApiUsage,
  getApiUsageStats,
  resetApiKeyManager,
} from "../lib/services/api-key-manager"

async function testApiKeyManager() {
  console.log("=".repeat(60))
  console.log("API KEY MANAGER TEST")
  console.log("=".repeat(60))

  // Reset for clean test
  resetApiKeyManager()

  // Test 1: Get initial stats
  console.log("\n1. Initial API Key Stats:")
  const initialStats = getApiUsageStats()
  console.log(`Total Keys: ${initialStats.totalKeys}`)
  console.log(`Active Keys: ${initialStats.activeKeys}`)
  console.log(`Total Usage: ${initialStats.totalUsage}`)
  console.log(`Total Limit: ${initialStats.totalLimit}`)
  console.log("\nKey Details:")
  initialStats.keys.forEach((key) => {
    console.log(
      `  - ${key.accountName}: ${key.usage}/${key.limit} (${key.isActive ? "Active" : "Inactive"})`
    )
  })

  // Test 2: Get API keys
  console.log("\n\n2. Testing API Key Rotation:")
  const keys: Array<{ key: string; accountName: string }> = []

  for (let i = 0; i < 5; i++) {
    try {
      const apiKey = getNextGoogleApiKey()
      keys.push(apiKey)
      console.log(`Request ${i + 1}: ${apiKey.accountName}`)
    } catch (error) {
      console.error(`Request ${i + 1}: ❌ ${error instanceof Error ? error.message : error}`)
      break
    }
  }

  // Test 3: Record usage
  console.log("\n\n3. Recording API Usage:")
  keys.forEach((apiKey, index) => {
    recordApiUsage(apiKey.accountName)
    console.log(`Recorded usage for ${apiKey.accountName} (request ${index + 1})`)
  })

  // Test 4: Check updated stats
  console.log("\n\n4. Updated API Key Stats:")
  const updatedStats = getApiUsageStats()
  console.log(`Total Keys: ${updatedStats.totalKeys}`)
  console.log(`Active Keys: ${updatedStats.activeKeys}`)
  console.log(`Total Usage: ${updatedStats.totalUsage}/${updatedStats.totalLimit}`)
  console.log("\nKey Details:")
  updatedStats.keys.forEach((key) => {
    console.log(
      `  - ${key.accountName}: ${key.usage}/${key.limit} (${key.isActive ? "✅ Active" : "❌ Inactive"})`
    )
  })

  // Test 5: Simulate reaching limit
  console.log("\n\n5. Simulating Daily Limit:")
  console.log("Recording 95 more usages for Primary Account...")

  for (let i = 0; i < 95; i++) {
    recordApiUsage("Primary Account")
  }

  const limitedStats = getApiUsageStats()
  console.log(`Primary Account: ${limitedStats.keys[0].usage}/${limitedStats.keys[0].limit}`)
  console.log(`Active: ${limitedStats.keys[0].isActive ? "✅ Yes" : "❌ No (Limit Reached)"}`)

  // Test 6: Try to get key after limit
  console.log("\n\n6. Testing After Limit:")
  try {
    const apiKey = getNextGoogleApiKey()
    console.log(`✅ Got key from: ${apiKey.accountName}`)
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : error}`)
  }

  console.log("\n" + "=".repeat(60))
  console.log("TEST COMPLETED")
  console.log("=".repeat(60))

  // Summary
  console.log("\n📊 Summary:")
  console.log(`- Total API Keys Configured: ${initialStats.totalKeys}`)
  console.log(`- Daily Limit per Key: 100 images`)
  console.log(`- Total Daily Capacity: ${initialStats.totalLimit} images`)
  console.log(`- Strategy: Round-robin rotation across all keys`)
  console.log(`- Cost: $0 (Free Tier)`)
}

testApiKeyManager()
  .then(() => {
    console.log("\n✅ All tests completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error)
    process.exit(1)
  })
