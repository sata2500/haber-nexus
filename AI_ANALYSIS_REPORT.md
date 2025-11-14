# HaberNexus AI Özellikleri Analiz Raporu

**Tarih**: 14 Kasım 2025  
**Geliştirici**: Manus AI  
**Proje Sahibi**: Salih TANRISEVEN

---

## Proje Özeti

**HaberNexus**, Google Gemini API kullanarak RSS kaynaklarından otomatik haber tarama, analiz ve özgün makale üretimi yapan modern bir haber platformudur. Proje Next.js 16, TypeScript, Prisma ORM ve PostgreSQL ile geliştirilmiştir.

---

## Mevcut AI Altyapısı

### 1. AI Modülleri

#### 1.1 `/lib/ai/gemini.ts` - Google Gemini Entegrasyonu

Mevcut fonksiyonlar:
- ✅ `generateText()` - Genel metin üretimi
- ✅ `summarizeContent()` - İçerik özetleme
- ✅ `generateTags()` - Otomatik tag oluşturma
- ✅ `generateSeoTitle()` - SEO dostu başlık üretme
- ✅ `generateMetaDescription()` - Meta açıklama oluşturma
- ✅ `analyzeQuality()` - İçerik kalite analizi (0-1 skor)
- ✅ `rewriteContent()` - İçerik yeniden yazma (formal/casual/news/blog)
- ✅ `extractKeywords()` - Anahtar kelime çıkarma
- ✅ `detectCategory()` - Kategori tespiti
- ✅ `isSpam()` - Spam kontrolü

**Kullanılan Model**: `gemini-2.0-flash-exp`

**Model Konfigürasyonu**:
- Temperature: 0.7 (varsayılan)
- TopP: 0.95
- TopK: 40
- Max Output Tokens: 8192

#### 1.2 `/lib/ai/processor.ts` - İçerik İşleme Pipeline

- ✅ `processRssItem()` - RSS öğesini AI ile işleme
- ✅ `batchProcessRssItems()` - Toplu RSS işleme
- ✅ `createSlug()` - URL dostu slug oluşturma (Türkçe karakter desteği)

**İşleme Süreci**:
1. RSS içeriğini temizleme
2. Spam kontrolü
3. Kalite analizi (minimum skor kontrolü)
4. İçerik yeniden yazma (opsiyonel)
5. SEO başlığı üretme
6. Meta açıklama oluşturma
7. Özet oluşturma
8. Anahtar kelime çıkarma
9. Tag üretme
10. Slug oluşturma

#### 1.3 `/lib/ai/types.ts` - Tip Tanımlamaları

TypeScript tip güvenliği için AI ve RSS işleme tipleri tanımlanmış.

### 2. RSS Altyapısı

#### 2.1 `/lib/rss/parser.ts` - RSS Parser

- ✅ `parseRssFeed()` - RSS feed'i parse etme
- ✅ `validateRssFeed()` - RSS feed doğrulama
- ✅ `extractTextFromHtml()` - HTML'den metin çıkarma
- ✅ `cleanRssContent()` - RSS içeriğini temizleme
- ✅ `isDuplicateItem()` - Tekrar kontrolü
- ✅ `filterRecentItems()` - Son 24 saatteki öğeleri filtreleme

#### 2.2 `/lib/rss/scanner.ts` - Otomatik Tarama

- ✅ `scanRssFeed()` - Tek bir RSS feed'i tarama
- ✅ `scanAllFeeds()` - Tüm aktif feed'leri tarama

**Tarama Süreci**:
1. RSS feed'i veritabanından getirme
2. RSS feed'i parse etme
3. Son 24 saatteki öğeleri filtreleme
4. Her öğeyi AI ile işleme
5. Tag'leri oluşturma/bağlama
6. Makale oluşturma (DRAFT veya PUBLISHED)
7. İstatistikleri güncelleme
8. Scan log kaydetme

### 3. API Endpoints

#### 3.1 AI Test Endpoint
- `POST /api/ai/test` - AI fonksiyonlarını test etme (Admin only)

Desteklenen aksiyonlar:
- `summarize` - Özet oluşturma
- `tags` - Tag üretme
- `seo_title` - SEO başlığı
- `meta_description` - Meta açıklama
- `quality` - Kalite analizi
- `keywords` - Anahtar kelime çıkarma
- `generate` - Genel metin üretimi

#### 3.2 RSS Feed Endpoints
- `GET /api/rss-feeds` - RSS feed listesi
- `POST /api/rss-feeds` - Yeni RSS feed ekleme
- `GET /api/rss-feeds/[id]` - RSS feed detayı
- `PATCH /api/rss-feeds/[id]` - RSS feed güncelleme
- `DELETE /api/rss-feeds/[id]` - RSS feed silme
- `POST /api/rss-feeds/[id]/scan` - Manuel tarama
- `POST /api/rss-feeds/scan-all` - Tüm feed'leri tarama

### 4. Veritabanı Yapısı

#### AI İlgili Modeller:

**Article** (Makale):
- `aiGenerated: Boolean` - AI tarafından üretildi mi?
- `aiSummary: String` - AI özeti
- `aiTags: String[]` - AI tarafından üretilen tag'ler
- `sourceRssId: String` - Kaynak RSS feed

**RssFeed** (RSS Kaynağı):
- `isActive: Boolean` - Aktif mi?
- `scanInterval: Int` - Tarama aralığı (dakika)
- `priority: Int` - Öncelik (1-10)
- `lastScannedAt: DateTime` - Son tarama zamanı
- `totalScans: Int` - Toplam tarama sayısı
- `totalArticles: Int` - Toplam makale sayısı
- `successRate: Float` - Başarı oranı
- `minQualityScore: Float` - Minimum kalite skoru (0.5 varsayılan)
- `autoPublish: Boolean` - Otomatik yayınlama

**RssScanLog** (Tarama Logu):
- `status: ScanStatus` - SUCCESS/PARTIAL/FAILED
- `itemsFound: Int` - Bulunan öğe sayısı
- `itemsProcessed: Int` - İşlenen öğe sayısı
- `itemsPublished: Int` - Yayınlanan öğe sayısı
- `error: String` - Hata mesajı
- `duration: Int` - Süre (ms)

**AiTask** (AI Görevi):
- `type: AiTaskType` - Görev tipi (RSS_SCAN, CONTENT_GENERATE, vb.)
- `status: TaskStatus` - PENDING/PROCESSING/COMPLETED/FAILED/CANCELLED
- `priority: Int` - Öncelik
- `input: Json` - Giriş verisi
- `output: Json` - Çıkış verisi
- `attempts: Int` - Deneme sayısı
- `maxAttempts: Int` - Maksimum deneme (3 varsayılan)
- `scheduledAt: DateTime` - Zamanlanmış zaman

---

## Güçlü Yönler

1. ✅ **Kapsamlı AI Fonksiyonları**: Google Gemini ile 10+ AI fonksiyonu entegre edilmiş
2. ✅ **Kalite Kontrolü**: Spam kontrolü ve kalite skorlama sistemi
3. ✅ **SEO Optimizasyonu**: Otomatik SEO başlığı, meta açıklama ve anahtar kelime üretimi
4. ✅ **Türkçe Desteği**: Türkçe karakter dönüşümü ve Türkçe prompt'lar
5. ✅ **Modüler Yapı**: AI, RSS ve işleme katmanları ayrılmış
6. ✅ **Hata Yönetimi**: Try-catch blokları ve error handling
7. ✅ **Veritabanı Entegrasyonu**: Prisma ORM ile tip güvenli veritabanı işlemleri
8. ✅ **Loglama**: RSS tarama logları ve istatistikler
9. ✅ **Toplu İşleme**: Batch processing desteği
10. ✅ **Esneklik**: Farklı yazım stilleri ve parametreler

---

## Geliştirme Fırsatları

### 1. Performans ve Ölçeklenebilirlik

#### 1.1 Rate Limiting ve Quota Yönetimi
**Sorun**: Google Gemini API için rate limiting ve quota kontrolü yok.

**Çözüm**:
```typescript
// lib/ai/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  return { success, limit, reset, remaining }
}
```

#### 1.2 Caching Mekanizması
**Sorun**: Aynı içerik için tekrar tekrar AI çağrısı yapılıyor.

**Çözüm**:
```typescript
// lib/ai/cache.ts
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function getCachedResult(key: string) {
  return await redis.get(key)
}

export async function setCachedResult(key: string, value: any, ttl: number = 3600) {
  await redis.set(key, value, { ex: ttl })
}

// Kullanım:
const cacheKey = `ai:summary:${hash(content)}`
const cached = await getCachedResult(cacheKey)
if (cached) return cached

const result = await summarizeContent(content)
await setCachedResult(cacheKey, result)
```

#### 1.3 Background Job Queue
**Sorun**: RSS tarama ve AI işleme senkron yapılıyor, uzun sürebiliyor.

**Çözüm**: BullMQ veya Inngest ile job queue sistemi

```typescript
// lib/jobs/queue.ts
import { Queue, Worker } from "bullmq"

export const aiQueue = new Queue("ai-tasks", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
})

// Worker
const worker = new Worker("ai-tasks", async (job) => {
  const { type, data } = job.data
  
  switch (type) {
    case "rss_scan":
      return await scanRssFeed(data.feedId)
    case "process_article":
      return await processRssItem(data.item)
    default:
      throw new Error(`Unknown job type: ${type}`)
  }
})
```

### 2. AI Yetenekleri Geliştirme

#### 2.1 Görsel İçerik Analizi
**Özellik**: RSS feed'lerinden gelen görselleri analiz etme ve açıklama oluşturma.

```typescript
// lib/ai/vision.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function analyzeImage(imageUrl: string): Promise<{
  description: string
  altText: string
  tags: string[]
}> {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

  const image = await fetch(imageUrl).then(r => r.arrayBuffer())
  
  const result = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(image).toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    "Bu görseli Türkçe olarak detaylı bir şekilde açıkla. Alt text ve tag'ler öner.",
  ])

  const text = result.response.text()
  
  // Parse response
  return {
    description: text,
    altText: extractAltText(text),
    tags: extractTags(text),
  }
}
```

#### 2.2 Çoklu Dil Desteği
**Özellik**: İçerikleri farklı dillere çevirme.

```typescript
// lib/ai/translation.ts
export async function translateContent(
  content: string,
  targetLang: "en" | "de" | "fr" | "es" | "ar"
): Promise<string> {
  const langNames = {
    en: "İngilizce",
    de: "Almanca",
    fr: "Fransızca",
    es: "İspanyolca",
    ar: "Arapça",
  }

  const prompt = `
Aşağıdaki Türkçe içeriği ${langNames[targetLang]} diline çevir.
Çeviride doğal ve akıcı bir dil kullan.

İçerik:
${content}

Çeviri:
`.trim()

  return await generateText(prompt, { temperature: 0.3 })
}
```

#### 2.3 Fact-Checking ve Kaynak Doğrulama
**Özellik**: İçerikteki iddiaları doğrulama ve kaynak önerme.

```typescript
// lib/ai/fact-check.ts
export async function factCheck(content: string): Promise<{
  claims: Array<{
    claim: string
    verdict: "true" | "false" | "unverified"
    confidence: number
    sources: string[]
  }>
  overallScore: number
}> {
  const prompt = `
Aşağıdaki haber içeriğindeki önemli iddiaları tespit et ve doğruluklarını değerlendir.

JSON formatında yanıt ver:
{
  "claims": [
    {
      "claim": "İddia metni",
      "verdict": "true/false/unverified",
      "confidence": 0.85,
      "sources": ["kaynak1.com", "kaynak2.com"]
    }
  ],
  "overallScore": 0.75
}

Haber İçeriği:
${content}

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.2 })
  return JSON.parse(response)
}
```

#### 2.4 Trend Analizi ve Öneri Sistemi
**Özellik**: Popüler konuları tespit etme ve içerik önerisi.

```typescript
// lib/ai/trends.ts
export async function analyzeTrends(articles: Article[]): Promise<{
  topics: Array<{
    name: string
    count: number
    trend: "rising" | "stable" | "falling"
  }>
  recommendations: string[]
}> {
  const contents = articles.map(a => a.title + " " + a.excerpt).join("\n")

  const prompt = `
Aşağıdaki makale başlıkları ve özetlerinden trend konuları tespit et.

JSON formatında yanıt ver:
{
  "topics": [
    {
      "name": "Yapay Zeka",
      "count": 15,
      "trend": "rising"
    }
  ],
  "recommendations": [
    "Yapay zeka etiği hakkında derinlemesine bir analiz yazılabilir"
  ]
}

Makaleler:
${contents}

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.4 })
  return JSON.parse(response)
}
```

#### 2.5 Otomatik Görsel Üretimi
**Özellik**: Makale içeriğine uygun görsel üretme.

**Not**: Google Gemini henüz görsel üretimi desteklemiyor. Alternatif olarak:
- DALL-E 3 API (OpenAI)
- Stable Diffusion API
- Midjourney API

```typescript
// lib/ai/image-generation.ts
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateCoverImage(
  title: string,
  excerpt: string
): Promise<string> {
  const prompt = `
Haber makalesi için profesyonel bir kapak görseli:
Başlık: ${title}
Özet: ${excerpt}

Stil: Modern, temiz, haber sitesine uygun, metin içermeyen
`.trim()

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
  })

  return response.data[0].url!
}
```

#### 2.6 Sentiment Analizi
**Özellik**: İçeriğin duygusal tonunu analiz etme.

```typescript
// lib/ai/sentiment.ts
export async function analyzeSentiment(content: string): Promise<{
  sentiment: "positive" | "negative" | "neutral"
  score: number
  emotions: Record<string, number>
}> {
  const prompt = `
Aşağıdaki haber içeriğinin duygusal tonunu analiz et.

JSON formatında yanıt ver:
{
  "sentiment": "positive/negative/neutral",
  "score": 0.65,
  "emotions": {
    "joy": 0.3,
    "anger": 0.1,
    "sadness": 0.2,
    "fear": 0.15,
    "surprise": 0.25
  }
}

İçerik:
${content}

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.2 })
  return JSON.parse(response)
}
```

### 3. Kullanıcı Deneyimi İyileştirmeleri

#### 3.1 AI Asistan Chatbot
**Özellik**: Kullanıcıların sorularını yanıtlayan AI asistan.

```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { message, context } = await request.json()

  const prompt = `
Sen HaberNexus platformunun yardımcı asistanısın.
Kullanıcının sorusunu Türkçe olarak yanıtla.

${context ? `Bağlam: ${context}` : ""}

Kullanıcı: ${message}

Asistan:
`.trim()

  const response = await generateText(prompt, { temperature: 0.7 })
  
  return NextResponse.json({ response })
}
```

#### 3.2 Kişiselleştirilmiş İçerik Önerileri
**Özellik**: Kullanıcı davranışlarına göre makale önerme.

```typescript
// lib/ai/recommendations.ts
export async function getPersonalizedRecommendations(
  userId: string,
  limit: number = 10
): Promise<Article[]> {
  // Kullanıcının okuma geçmişi
  const readArticles = await prisma.article.findMany({
    where: {
      likes: { some: { userId } },
    },
    include: { tags: true, category: true },
  })

  // AI ile benzer içerikleri bul
  const userInterests = readArticles
    .flatMap(a => a.tags.map(t => t.name))
    .join(", ")

  const allArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      id: { notIn: readArticles.map(a => a.id) },
    },
    include: { tags: true },
  })

  // AI ile skorlama
  const scored = await Promise.all(
    allArticles.map(async (article) => {
      const prompt = `
Kullanıcı ilgi alanları: ${userInterests}
Makale: ${article.title}
Tag'ler: ${article.tags.map(t => t.name).join(", ")}

Bu makale kullanıcı için ne kadar ilginç? (0-1 arası skor ver, sadece sayı)
`.trim()

      const scoreText = await generateText(prompt, { temperature: 0.2 })
      const score = parseFloat(scoreText) || 0

      return { article, score }
    })
  )

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.article)
}
```

### 4. Güvenlik ve Moderasyon

#### 4.1 Gelişmiş İçerik Moderasyonu
**Özellik**: Uygunsuz içerik tespiti ve filtreleme.

```typescript
// lib/ai/moderation.ts
export async function moderateContent(content: string): Promise<{
  safe: boolean
  categories: {
    hate: number
    violence: number
    sexual: number
    selfHarm: number
    spam: number
  }
  flaggedPhrases: string[]
}> {
  const prompt = `
Aşağıdaki içeriği moderasyon açısından değerlendir.

Kategoriler:
- hate: Nefret söylemi
- violence: Şiddet içeriği
- sexual: Cinsel içerik
- selfHarm: Kendine zarar
- spam: Spam/Reklam

JSON formatında yanıt ver (0-1 arası skorlar):
{
  "safe": true,
  "categories": {
    "hate": 0.1,
    "violence": 0.05,
    "sexual": 0.0,
    "selfHarm": 0.0,
    "spam": 0.2
  },
  "flaggedPhrases": []
}

İçerik:
${content}

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.1 })
  return JSON.parse(response)
}
```

### 5. Analytics ve Raporlama

#### 5.1 AI Destekli İçerik Performans Analizi
**Özellik**: Makalelerin performansını analiz etme ve öneriler sunma.

```typescript
// lib/ai/analytics.ts
export async function analyzeArticlePerformance(
  article: Article & { stats: ArticleStats }
): Promise<{
  score: number
  insights: string[]
  improvements: string[]
}> {
  const prompt = `
Makale performansını analiz et:

Başlık: ${article.title}
Görüntülenme: ${article.viewCount}
Beğeni: ${article.likeCount}
Yorum: ${article.commentCount}
Paylaşım: ${article.shareCount}
Yayın Tarihi: ${article.publishedAt}

JSON formatında yanıt ver:
{
  "score": 0.75,
  "insights": [
    "Başlık dikkat çekici",
    "Yorum oranı düşük"
  ],
  "improvements": [
    "Daha fazla görsel eklenebilir",
    "Sosyal medya paylaşımı artırılmalı"
  ]
}

Analiz:
`.trim()

  const response = await generateText(prompt, { temperature: 0.4 })
  return JSON.parse(response)
}
```

---

## Öncelikli Geliştirme Önerileri

### Kısa Vadeli (1-2 Hafta)

1. **Rate Limiting ve Caching** ⭐⭐⭐
   - Upstash Redis entegrasyonu
   - AI çağrıları için cache sistemi
   - Maliyet optimizasyonu

2. **Background Job Queue** ⭐⭐⭐
   - BullMQ veya Inngest entegrasyonu
   - RSS tarama job'ları
   - AI işleme job'ları
   - Retry mekanizması

3. **Görsel İçerik Analizi** ⭐⭐
   - Gemini Vision API entegrasyonu
   - Otomatik alt text oluşturma
   - Görsel tag'leme

4. **Gelişmiş Moderasyon** ⭐⭐
   - İçerik moderasyon sistemi
   - Otomatik spam filtreleme
   - Uygunsuz içerik tespiti

### Orta Vadeli (1-2 Ay)

5. **AI Asistan Chatbot** ⭐⭐⭐
   - Kullanıcı desteği
   - İçerik arama yardımı
   - Kişiselleştirilmiş öneriler

6. **Otomatik Görsel Üretimi** ⭐⭐
   - DALL-E 3 entegrasyonu
   - Makale kapak görselleri
   - Sosyal medya görselleri

7. **Çoklu Dil Desteği** ⭐⭐
   - Otomatik çeviri
   - Çok dilli içerik yönetimi
   - i18n entegrasyonu

8. **Fact-Checking** ⭐
   - İddia tespiti
   - Kaynak doğrulama
   - Güvenilirlik skoru

### Uzun Vadeli (3-6 Ay)

9. **Kişiselleştirilmiş Öneriler** ⭐⭐⭐
   - Kullanıcı profilleme
   - Davranış analizi
   - AI destekli öneri motoru

10. **Trend Analizi** ⭐⭐
    - Popüler konu tespiti
    - İçerik stratejisi önerileri
    - Tahmine dayalı analitik

11. **Sentiment Analizi** ⭐
    - Duygusal ton analizi
    - Okuyucu tepki tahmini
    - İçerik optimizasyonu

12. **Performans Analizi** ⭐⭐
    - AI destekli analytics
    - İçerik performans raporları
    - Otomatik iyileştirme önerileri

---

## Teknik Gereksinimler

### Yeni Bağımlılıklar

```json
{
  "dependencies": {
    "@upstash/redis": "^1.34.3",
    "@upstash/ratelimit": "^2.0.3",
    "bullmq": "^5.20.5",
    "ioredis": "^5.4.1",
    "openai": "^4.75.0"
  }
}
```

### Environment Variables

```env
# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# OpenAI (Görsel üretimi için)
OPENAI_API_KEY=

# Rate Limiting
AI_RATE_LIMIT_PER_MINUTE=10
AI_RATE_LIMIT_PER_HOUR=100
```

---

## Sonuç

HaberNexus projesi güçlü bir AI altyapısına sahip. Mevcut Google Gemini entegrasyonu iyi çalışıyor ve temel özellikleri karşılıyor. Ancak ölçeklenebilirlik, performans ve kullanıcı deneyimi açısından önemli geliştirme fırsatları var.

**Öncelikli odaklanılması gereken alanlar**:
1. Rate limiting ve caching (maliyet optimizasyonu)
2. Background job queue (performans)
3. AI asistan chatbot (kullanıcı deneyimi)
4. Kişiselleştirilmiş öneriler (engagement)

Bu geliştirmeler tamamlandığında, HaberNexus production-ready, ölçeklenebilir ve kullanıcı dostu bir AI destekli haber platformu olacaktır.
