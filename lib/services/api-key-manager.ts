/**
 * Multi-Account API Key Manager
 * Rotates between multiple Google API keys to stay within free tier limits
 */

// API key management does not require database access

export interface ApiKeyConfig {
  key: string
  accountName: string
  dailyLimit: number
  usageCount: number
  lastResetDate: Date
  isActive: boolean
}

/**
 * Load API keys from environment variables
 * Format: GOOGLE_API_KEY_1, GOOGLE_API_KEY_2, etc.
 */
function loadApiKeysFromEnv(): ApiKeyConfig[] {
  const keys: ApiKeyConfig[] = []
  let index = 1

  // Try to load GOOGLE_API_KEY (primary)
  const primaryKey = process.env.GOOGLE_API_KEY
  if (primaryKey) {
    keys.push({
      key: primaryKey,
      accountName: "Primary Account",
      dailyLimit: 100, // Conservative daily limit for free tier
      usageCount: 0,
      lastResetDate: new Date(),
      isActive: true,
    })
  }

  // Load additional keys (GOOGLE_API_KEY_1, GOOGLE_API_KEY_2, etc.)
  while (true) {
    const key = process.env[`GOOGLE_API_KEY_${index}`]
    if (!key) break

    keys.push({
      key,
      accountName: `Account ${index}`,
      dailyLimit: 100, // Conservative daily limit for free tier
      usageCount: 0,
      lastResetDate: new Date(),
      isActive: true,
    })

    index++
  }

  return keys
}

/**
 * In-memory cache for API key usage
 */
class ApiKeyCache {
  private keys: ApiKeyConfig[]
  private currentIndex: number = 0

  constructor() {
    this.keys = loadApiKeysFromEnv()
    if (this.keys.length === 0) {
      throw new Error("No Google API keys configured. Please set GOOGLE_API_KEY or GOOGLE_API_KEY_1, GOOGLE_API_KEY_2, etc.")
    }
    console.error(`[API Key Manager] Loaded ${this.keys.length} API key(s)`)
  }

  /**
   * Reset usage counts if a new day has started
   */
  private resetDailyUsageIfNeeded(): void {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    for (const keyConfig of this.keys) {
      const lastResetDay = new Date(
        keyConfig.lastResetDate.getFullYear(),
        keyConfig.lastResetDate.getMonth(),
        keyConfig.lastResetDate.getDate()
      )

      if (today > lastResetDay) {
        console.error(
          `[API Key Manager] Resetting daily usage for ${keyConfig.accountName} (was ${keyConfig.usageCount})`
        )
        keyConfig.usageCount = 0
        keyConfig.lastResetDate = now
        keyConfig.isActive = true
      }
    }
  }

  /**
   * Get next available API key using round-robin strategy
   */
  getNextKey(): { key: string; accountName: string } {
    this.resetDailyUsageIfNeeded()

    // Find first available key (under daily limit)
    const availableKeys = this.keys.filter(
      (k) => k.isActive && k.usageCount < k.dailyLimit
    )

    if (availableKeys.length === 0) {
      console.error(
        `[API Key Manager] All API keys exhausted for today. Total keys: ${this.keys.length}`
      )
      throw new Error(
        "All Google API keys have reached their daily limit. Please try again tomorrow or add more API keys."
      )
    }

    // Round-robin selection
    const selectedKey = availableKeys[this.currentIndex % availableKeys.length]
    this.currentIndex = (this.currentIndex + 1) % availableKeys.length

    console.error(
      `[API Key Manager] Selected ${selectedKey.accountName} (usage: ${selectedKey.usageCount}/${selectedKey.dailyLimit})`
    )

    return {
      key: selectedKey.key,
      accountName: selectedKey.accountName,
    }
  }

  /**
   * Record successful API usage
   */
  recordUsage(accountName: string): void {
    const keyConfig = this.keys.find((k) => k.accountName === accountName)
    if (keyConfig) {
      keyConfig.usageCount++
      console.error(
        `[API Key Manager] Recorded usage for ${accountName} (${keyConfig.usageCount}/${keyConfig.dailyLimit})`
      )

      // Deactivate if limit reached
      if (keyConfig.usageCount >= keyConfig.dailyLimit) {
        keyConfig.isActive = false
        console.error(
          `[API Key Manager] ${accountName} reached daily limit, deactivating until tomorrow`
        )
      }
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): {
    totalKeys: number
    activeKeys: number
    totalUsage: number
    totalLimit: number
    keys: Array<{
      accountName: string
      usage: number
      limit: number
      isActive: boolean
    }>
  } {
    this.resetDailyUsageIfNeeded()

    return {
      totalKeys: this.keys.length,
      activeKeys: this.keys.filter((k) => k.isActive).length,
      totalUsage: this.keys.reduce((sum, k) => sum + k.usageCount, 0),
      totalLimit: this.keys.reduce((sum, k) => sum + k.dailyLimit, 0),
      keys: this.keys.map((k) => ({
        accountName: k.accountName,
        usage: k.usageCount,
        limit: k.dailyLimit,
        isActive: k.isActive,
      })),
    }
  }
}

// Singleton instance
let apiKeyCache: ApiKeyCache | null = null

/**
 * Get API key manager instance
 */
function getApiKeyManager(): ApiKeyCache {
  if (!apiKeyCache) {
    apiKeyCache = new ApiKeyCache()
  }
  return apiKeyCache
}

/**
 * Get next available Google API key
 */
export function getNextGoogleApiKey(): { key: string; accountName: string } {
  const manager = getApiKeyManager()
  return manager.getNextKey()
}

/**
 * Record API usage for tracking
 */
export function recordApiUsage(accountName: string): void {
  const manager = getApiKeyManager()
  manager.recordUsage(accountName)
}

/**
 * Get current API usage statistics
 */
export function getApiUsageStats(): {
  totalKeys: number
  activeKeys: number
  totalUsage: number
  totalLimit: number
  keys: Array<{
    accountName: string
    usage: number
    limit: number
    isActive: boolean
  }>
} {
  const manager = getApiKeyManager()
  return manager.getUsageStats()
}

/**
 * Reset API key manager (for testing)
 */
export function resetApiKeyManager(): void {
  apiKeyCache = null
}
