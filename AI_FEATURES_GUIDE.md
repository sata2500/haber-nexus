# HaberNexus - Gelişmiş AI Özellikleri Kullanım Kılavuzu

**Tarih**: 14 Kasım 2025  
**Geliştirici**: Manus AI

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Yeni AI Modülleri](#yeni-ai-modülleri)
3. [API Kullanımı](#api-kullanımı)
4. [Örnekler](#örnekler)
5. [Veritabanı Değişiklikleri](#veritabanı-değişiklikleri)

---

## Genel Bakış

HaberNexus'a eklenen gelişmiş AI özellikleri:

### ✨ Yeni Özellikler

1. **Görsel İçerik Analizi** (`lib/ai/vision.ts`)
   - Görsel analiz ve açıklama oluşturma
   - Otomatik alt text üretimi
   - En iyi kapak görseli seçimi
   - Görsel etiketleme

2. **Sentiment Analizi** (`lib/ai/sentiment.ts`)
   - Duygu tonu analizi (pozitif/negatif/nötr)
   - Detaylı emotion skoru
   - Sentiment trend analizi
   - Ton ayarlama önerileri

3. **İçerik Moderasyonu** (`lib/ai/moderation.ts`)
   - Otomatik içerik güvenlik kontrolü
   - Spam ve uygunsuz içerik tespiti
   - Fact-checking ve doğruluk kontrolü
   - Plagiarism tespiti

4. **Trend Analizi** (`lib/ai/trends.ts`)
   - Popüler konu tespiti
   - Kişiselleştirilmiş içerik önerileri
   - İçerik stratejisi önerileri
   - Trend tahminleri

5. **Çoklu Dil Desteği** (`lib/ai/translation.ts`)
   - 9 dil desteği (TR, EN, DE, FR, ES, AR, RU, ZH, JA)
   - Otomatik dil tespiti
   - Makale çevirisi
   - Çeviri kalite iyileştirme

6. **Gelişmiş İçerik İşleme** (`lib/ai/advanced-processor.ts`)
   - Tüm AI özelliklerini birleştiren pipeline
   - Kapsamlı makale raporu
   - Batch processing desteği

---

## Yeni AI Modülleri

### 1. Vision (Görsel Analiz)

```typescript
import { analyzeImage, extractAndAnalyzeImages, selectBestCoverImage } from "@/lib/ai/vision"

// Tek görsel analizi
const analysis = await analyzeImage("https://example.com/image.jpg")
console.log(analysis)
// {
//   description: "Görselin detaylı açıklaması",
//   altText: "Erişilebilirlik için kısa metin",
//   tags: ["tag1", "tag2", "tag3"],
//   isRelevant: true,
//   qualityScore: 0.85
// }

// HTML içeriğinden görselleri çıkarma ve analiz etme
const images = await extractAndAnalyzeImages(htmlContent)

// En iyi kapak görseli seçimi
const bestCover = selectBestCoverImage(images)
```

### 2. Sentiment (Duygu Analizi)

```typescript
import { analyzeSentiment, analyzeSentimentTrend } from "@/lib/ai/sentiment"

// Tek içerik analizi
const sentiment = await analyzeSentiment(content)
console.log(sentiment)
// {
//   sentiment: "positive",
//   score: 0.65,
//   confidence: 0.85,
//   emotions: {
//     joy: 0.3,
//     anger: 0.1,
//     sadness: 0.2,
//     fear: 0.15,
//     surprise: 0.15,
//     trust: 0.1
//   },
//   tone: ["bilgilendirici", "iyimser"]
// }

// Trend analizi
const trend = await analyzeSentimentTrend(articles)
```

### 3. Moderation (Moderasyon)

```typescript
import { moderateContent, checkFactAccuracy, detectPlagiarism } from "@/lib/ai/moderation"

// İçerik moderasyonu
const moderation = await moderateContent(content)
console.log(moderation)
// {
//   safe: true,
//   categories: {
//     hate: 0.1,
//     violence: 0.05,
//     sexual: 0.0,
//     selfHarm: 0.0,
//     spam: 0.2,
//     misinformation: 0.1,
//     harassment: 0.0
//   },
//   flaggedPhrases: [],
//   recommendation: "approve",
//   reason: ""
// }

// Fact-checking
const factCheck = await checkFactAccuracy(content)

// Plagiarism kontrolü
const plagiarism = await detectPlagiarism(content, sourceUrl)
```

### 4. Trends (Trend Analizi)

```typescript
import { analyzeTrends, getPersonalizedRecommendations, suggestContentIdeas } from "@/lib/ai/trends"

// Trend analizi
const trends = await analyzeTrends({ days: 7 })
console.log(trends)
// {
//   topics: [
//     {
//       name: "Yapay Zeka",
//       count: 15,
//       trend: "rising",
//       score: 0.85,
//       relatedTags: ["AI", "teknoloji"]
//     }
//   ],
//   recommendations: ["..."],
//   insights: ["..."]
// }

// Kişiselleştirilmiş öneriler
const recommendations = await getPersonalizedRecommendations(userId, 10)

// İçerik fikirleri
const ideas = await suggestContentIdeas({ category: "teknoloji", count: 5 })
```

### 5. Translation (Çeviri)

```typescript
import { translateContent, translateArticle, detectLanguage } from "@/lib/ai/translation"

// Basit çeviri
const translation = await translateContent(content, "en")

// Makale çevirisi (tüm metadata ile)
const translated = await translateArticle(article, "en")

// Dil tespiti
const detected = await detectLanguage(content)
```

### 6. Advanced Processor (Gelişmiş İşleme)

```typescript
import { advancedProcessRssItem, generateArticleReport } from "@/lib/ai/advanced-processor"

// RSS öğesini gelişmiş özelliklerle işleme
const processed = await advancedProcessRssItem(rssItem, {
  rewriteStyle: "news",
  minQualityScore: 0.6,
  generateNewContent: true,
  analyzeImages: true,
  checkFacts: true,
  analyzeSentiment: true,
  translateTo: ["en", "de"],
  strictModeration: true
})

// Kapsamlı rapor oluşturma
const report = await generateArticleReport(processed)
console.log(report)
// {
//   summary: "İçerik genel skoru: 85%...",
//   strengths: ["Yüksek kalite skoru", "..."],
//   weaknesses: ["..."],
//   recommendations: ["..."],
//   overallScore: 0.85
// }
```

---

## API Kullanımı

### 1. Advanced AI Endpoint

**POST** `/api/ai/advanced`

**Authentication**: Admin, Editor, Super Admin

**Desteklenen Aksiyonlar**:

#### Görsel Analizi
```json
{
  "action": "analyze_image",
  "data": {
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

#### Sentiment Analizi
```json
{
  "action": "analyze_sentiment",
  "data": {
    "content": "Makale içeriği..."
  }
}
```

#### İçerik Moderasyonu
```json
{
  "action": "moderate_content",
  "data": {
    "content": "Kontrol edilecek içerik..."
  }
}
```

#### Fact-Checking
```json
{
  "action": "check_facts",
  "data": {
    "content": "Kontrol edilecek iddialar..."
  }
}
```

#### Çeviri
```json
{
  "action": "translate",
  "data": {
    "content": "Çevrilecek metin...",
    "targetLang": "en",
    "sourceLang": "tr"
  }
}
```

#### Trend Analizi
```json
{
  "action": "analyze_trends",
  "data": {
    "days": 7,
    "minArticles": 3
  }
}
```

#### Kişiselleştirilmiş Öneriler
```json
{
  "action": "personalized_recommendations",
  "data": {
    "userId": "user_id_here",
    "limit": 10
  }
}
```

#### İçerik Fikirleri
```json
{
  "action": "suggest_content_ideas",
  "data": {
    "category": "teknoloji",
    "count": 5
  }
}
```

### 2. AI Analytics Endpoint

**GET** `/api/ai/analytics?days=30`

**Authentication**: Admin, Super Admin

**Response**:
```json
{
  "success": true,
  "period": {
    "start": "2025-10-15T00:00:00.000Z",
    "end": "2025-11-14T00:00:00.000Z",
    "days": 30
  },
  "articles": {
    "total": 150,
    "published": 120,
    "draft": 30,
    "publishRate": 80
  },
  "engagement": {
    "totalViews": 50000,
    "totalLikes": 3000,
    "totalComments": 500,
    "avgViews": 333,
    "avgLikes": 20,
    "avgComments": 3
  },
  "rssFeeds": [...],
  "aiTasks": {...},
  "topArticles": [...],
  "trend": [...]
}
```

---

## Örnekler

### Örnek 1: RSS Feed'den Makale Oluşturma (Gelişmiş)

```typescript
import { parseRssFeed } from "@/lib/rss/parser"
import { advancedProcessRssItem } from "@/lib/ai/advanced-processor"
import { prisma } from "@/lib/prisma"

async function createAdvancedArticleFromRss(feedUrl: string) {
  // RSS feed'i parse et
  const feed = await parseRssFeed(feedUrl)
  const firstItem = feed.items[0]

  // Gelişmiş işleme
  const processed = await advancedProcessRssItem(firstItem, {
    rewriteStyle: "news",
    minQualityScore: 0.6,
    generateNewContent: true,
    analyzeImages: true,
    checkFacts: true,
    analyzeSentiment: true,
    translateTo: ["en"],
    strictModeration: true
  })

  // Veritabanına kaydet
  const article = await prisma.article.create({
    data: {
      slug: processed.slug,
      title: processed.title,
      excerpt: processed.excerpt,
      content: processed.content,
      coverImage: processed.coverImage?.url,
      coverImageAltText: processed.coverImage?.altText,
      coverImageDescription: processed.coverImage?.description,
      
      type: "NEWS",
      status: "DRAFT",
      
      authorId: "admin_user_id",
      
      aiGenerated: true,
      aiSummary: processed.excerpt,
      aiTags: processed.tags,
      
      metaTitle: processed.metaTitle,
      metaDescription: processed.metaDescription,
      keywords: processed.keywords,
      
      qualityScore: processed.qualityScore,
      sentimentScore: processed.sentiment.score,
      sentimentType: processed.sentiment.sentiment,
      moderationScore: processed.moderation.safe ? 1.0 : 0.5,
      factCheckScore: processed.factCheck.overallScore,
      detectedLanguage: processed.detectedLanguage || "tr",
    }
  })

  // Çevirileri kaydet
  if (processed.translations) {
    for (const [lang, translation] of Object.entries(processed.translations)) {
      await prisma.articleTranslation.create({
        data: {
          articleId: article.id,
          language: lang,
          title: translation.title,
          excerpt: translation.excerpt,
          content: translation.content,
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        }
      })
    }
  }

  return article
}
```

### Örnek 2: Trend Bazlı İçerik Stratejisi

```typescript
import { analyzeTrends, suggestContentIdeas } from "@/lib/ai/trends"

async function createContentStrategy() {
  // Son 14 günün trendlerini analiz et
  const trends = await analyzeTrends({ days: 14 })

  console.log("Popüler Konular:")
  trends.topics.forEach(topic => {
    console.log(`- ${topic.name}: ${topic.count} makale (${topic.trend})`)
  })

  console.log("\nİçgörüler:")
  trends.insights.forEach(insight => {
    console.log(`- ${insight}`)
  })

  // İçerik fikirleri al
  const ideas = await suggestContentIdeas({ count: 10 })

  console.log("\nÖnerilen İçerik Fikirleri:")
  ideas.forEach((idea, i) => {
    console.log(`\n${i + 1}. ${idea.title}`)
    console.log(`   ${idea.description}`)
    console.log(`   İlgi: ${(idea.estimatedInterest * 100).toFixed(0)}%`)
    console.log(`   Anahtar Kelimeler: ${idea.keywords.join(", ")}`)
  })

  return { trends, ideas }
}
```

### Örnek 3: Kullanıcı İçin Kişiselleştirilmiş Feed

```typescript
import { getPersonalizedRecommendations } from "@/lib/ai/trends"
import { prisma } from "@/lib/prisma"

async function getPersonalizedFeed(userId: string) {
  // AI destekli öneriler al
  const recommendations = await getPersonalizedRecommendations(userId, 20)

  // Makale detaylarını getir
  const articles = await prisma.article.findMany({
    where: {
      id: {
        in: recommendations.map(r => r.articleId)
      }
    },
    include: {
      author: true,
      category: true,
      tags: true
    }
  })

  // Skorlara göre sırala
  const sortedArticles = articles
    .map(article => {
      const rec = recommendations.find(r => r.articleId === article.id)
      return {
        ...article,
        recommendationScore: rec?.score || 0,
        recommendationReason: rec?.reason || ""
      }
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)

  return sortedArticles
}
```

---

## Veritabanı Değişiklikleri

### Yeni Article Alanları

```sql
ALTER TABLE "Article" ADD COLUMN "qualityScore" DOUBLE PRECISION DEFAULT 0.5;
ALTER TABLE "Article" ADD COLUMN "sentimentScore" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "Article" ADD COLUMN "sentimentType" TEXT DEFAULT 'neutral';
ALTER TABLE "Article" ADD COLUMN "moderationScore" DOUBLE PRECISION DEFAULT 1.0;
ALTER TABLE "Article" ADD COLUMN "factCheckScore" DOUBLE PRECISION DEFAULT 0.5;
ALTER TABLE "Article" ADD COLUMN "detectedLanguage" TEXT DEFAULT 'tr';
ALTER TABLE "Article" ADD COLUMN "coverImageAltText" TEXT;
ALTER TABLE "Article" ADD COLUMN "coverImageDescription" TEXT;
```

### Yeni ArticleTranslation Tablosu

```sql
CREATE TABLE "ArticleTranslation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "articleId" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "ArticleTranslation_articleId_fkey" 
    FOREIGN KEY ("articleId") REFERENCES "Article"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

---

## Performans ve Maliyet Optimizasyonu

### Öneriler

1. **Rate Limiting**: Upstash Redis ile API çağrılarını sınırlayın
2. **Caching**: Sık kullanılan AI sonuçlarını cache'leyin
3. **Batch Processing**: Birden fazla öğeyi toplu işleyin
4. **Selective Features**: Tüm özellikleri her zaman kullanmayın

### Örnek Cache Kullanımı

```typescript
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

async function getCachedOrGenerate(key: string, generator: () => Promise<any>) {
  // Cache'den kontrol et
  const cached = await redis.get(key)
  if (cached) return cached

  // Yoksa oluştur
  const result = await generator()
  
  // Cache'e kaydet (1 saat)
  await redis.set(key, result, { ex: 3600 })
  
  return result
}

// Kullanım
const summary = await getCachedOrGenerate(
  `summary:${articleId}`,
  () => summarizeContent(content)
)
```

---

## Sonraki Adımlar

1. ✅ Gelişmiş AI modülleri eklendi
2. ✅ API endpoint'leri oluşturuldu
3. ✅ Veritabanı şeması güncellendi
4. ⏳ Admin panel UI geliştirme
5. ⏳ Rate limiting ve caching
6. ⏳ Background job queue (BullMQ)
7. ⏳ Comprehensive testing

---

## Destek

Sorularınız için:
- GitHub Issues: https://github.com/sata2500/haber-nexus/issues
- Email: salihtanriseven25@gmail.com
