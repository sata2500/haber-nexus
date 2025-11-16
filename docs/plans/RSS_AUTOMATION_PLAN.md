# RSS Otomasyonu ve GitHub Actions Entegrasyonu Planı

**Tarih**: 16 Kasım 2025  
**Geliştirici**: Manus AI  
**Proje**: HaberNexus

---

## 📋 Genel Bakış

Bu döküman, HaberNexus projesinde RSS tarama sisteminin tamamen otomatikleştirilmesi, GitHub Actions ile entegrasyonu ve veritabanı temizleme mekanizmalarının geliştirilmesi için hazırlanmış detaylı bir plandır.

---

## 🎯 Proje Hedefleri

### Ana Hedefler

1. **GitHub Actions Entegrasyonu**
   - Her 2 saatte bir otomatik RSS taraması
   - Cron tabanlı zamanlama sistemi
   - Hata yönetimi ve loglama

2. **Veritabanı Optimizasyonu**
   - RSS verilerinin verimli kaydedilmesi
   - Eski verilerin otomatik temizlenmesi
   - Veritabanı şişmesinin önlenmesi

3. **Yapay Zeka Entegrasyonu**
   - Arka planda AI ile içerik işleme
   - Otomatik makale üretimi
   - Kalite kontrolü ve moderasyon

4. **Performans ve Güvenilirlik**
   - Timeout yönetimi
   - Hata toleransı
   - Detaylı monitoring ve raporlama

---

## 🏗️ Mevcut Sistem Analizi

### Mevcut Yapı

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel (Manual)                      │
│                  /admin/rss-feeds/page.tsx                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API Route: /api/rss-feeds/[id]/scan-async      │
│                    (Async Scan Trigger)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  RSS Scanner (lib/rss/scanner.ts)            │
│  • parseRssFeed() - RSS parse                                │
│  • filterRecentItems() - Son 24 saat filtreleme             │
│  • processRssItem() - AI ile işleme                         │
│  • Article oluşturma ve kaydetme                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Processor (lib/ai/processor.ts)         │
│  • İçerik yeniden yazma                                      │
│  • Kalite skoru hesaplama                                    │
│  • Tag ve keyword üretimi                                    │
│  • SEO optimizasyonu                                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Neon)                       │
│  • RssFeed                                                   │
│  • RssScanLog                                                │
│  • Article                                                   │
│  • Tag                                                       │
└─────────────────────────────────────────────────────────────┘
```

### Mevcut Özellikler

✅ **Çalışan Özellikler:**

- RSS feed yönetimi (CRUD)
- Manuel RSS taraması
- AI destekli içerik üretimi
- Veritabanı kaydı
- Tarama logları
- Başarı oranı takibi

❌ **Eksik Özellikler:**

- Otomatik zamanlama (cron)
- GitHub Actions entegrasyonu
- Eski veri temizleme
- Toplu tarama optimizasyonu
- Webhook/event sistemi

---

## 🚀 Yeni Sistem Mimarisi

### Hedef Yapı

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                   │
│              .github/workflows/rss-scan.yml                  │
│                  (Her 2 saatte bir çalışır)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API Route: /api/cron/rss-scan                   │
│              (Güvenli endpoint - API Key korumalı)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              RSS Batch Scanner (Yeni)                        │
│  • scanAllActiveFeeds() - Tüm aktif feedleri tara           │
│  • Paralel işleme desteği                                    │
│  • Öncelik bazlı sıralama                                    │
│  • Hata toleransı                                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Enhanced RSS Scanner (Geliştirilmiş)            │
│  • Duplicate kontrolü (URL hash bazlı)                      │
│  • Incremental tarama (sadece yeni öğeler)                  │
│  • Batch AI processing                                       │
│  • Retry mekanizması                                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Database Cleanup Service (Yeni)                 │
│  • Eski RssScanLog temizleme (30 gün)                       │
│  • Draft article temizleme (90 gün)                         │
│  • Orphaned data temizleme                                   │
│  • Veritabanı optimizasyonu                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Neon)                       │
│  + RssItem (Yeni) - RSS öğelerini cache için                │
│  + CleanupLog (Yeni) - Temizleme kayıtları                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Veritabanı Değişiklikleri

### Yeni Modeller

#### 1. RssItem (RSS Öğe Cache)

```prisma
model RssItem {
  id          String   @id @default(cuid())
  rssFeedId   String
  rssFeed     RssFeed  @relation(fields: [rssFeedId], references: [id], onDelete: Cascade)

  // Unique identifier
  guid        String   // RSS item GUID
  urlHash     String   @unique // URL'nin hash'i (duplicate kontrolü için)

  // Content
  title       String
  link        String
  description String?  @db.Text
  pubDate     DateTime

  // Processing status
  processed   Boolean  @default(false)
  articleId   String?  @unique
  article     Article? @relation(fields: [articleId], references: [id])

  // Metadata
  createdAt   DateTime @default(now())
  processedAt DateTime?

  @@index([rssFeedId])
  @@index([urlHash])
  @@index([processed])
  @@index([pubDate])
  @@unique([rssFeedId, guid])
}
```

#### 2. CleanupLog (Temizleme Kayıtları)

```prisma
model CleanupLog {
  id              String   @id @default(cuid())

  type            CleanupType
  status          String   // SUCCESS, FAILED, PARTIAL

  // Stats
  itemsDeleted    Int      @default(0)
  itemsKept       Int      @default(0)

  // Details
  details         Json?
  error           String?  @db.Text

  // Timing
  duration        Int      // milliseconds
  createdAt       DateTime @default(now())

  @@index([type])
  @@index([status])
  @@index([createdAt])
}

enum CleanupType {
  RSS_SCAN_LOGS
  RSS_ITEMS
  DRAFT_ARTICLES
  ORPHANED_DATA
  DATABASE_OPTIMIZE
}
```

### Mevcut Modellere Eklemeler

```prisma
model RssFeed {
  // ... mevcut alanlar

  // Yeni alanlar
  rssItems    RssItem[]    // RSS öğe cache'i
  lastItemDate DateTime?   // Son işlenen öğe tarihi (incremental scan için)
}

model Article {
  // ... mevcut alanlar

  // Yeni alanlar
  rssItem     RssItem?     // Kaynak RSS öğesi
  sourceGuid  String?      // Kaynak RSS GUID (duplicate kontrolü için)

  @@index([sourceGuid])
}
```

---

## 🔧 Geliştirme Adımları

### Faz 1: Veritabanı Şeması Güncellemeleri

**Dosyalar:**

- `prisma/schema.prisma`

**Görevler:**

1. ✅ RssItem modelini ekle
2. ✅ CleanupLog modelini ekle
3. ✅ RssFeed ve Article modellerini güncelle
4. ✅ Migration oluştur ve uygula

### Faz 2: Enhanced RSS Scanner

**Dosyalar:**

- `lib/rss/enhanced-scanner.ts` (Yeni)
- `lib/rss/scanner.ts` (Güncelleme)

**Görevler:**

1. ✅ Duplicate kontrolü (URL hash bazlı)
2. ✅ Incremental tarama (sadece yeni öğeler)
3. ✅ RssItem cache sistemi
4. ✅ Batch processing optimizasyonu
5. ✅ Retry mekanizması

### Faz 3: Database Cleanup Service

**Dosyalar:**

- `lib/services/cleanup-service.ts` (Yeni)

**Görevler:**

1. ✅ Eski RssScanLog temizleme (30 gün)
2. ✅ Eski RssItem temizleme (7 gün)
3. ✅ Draft article temizleme (90 gün, yayınlanmamış)
4. ✅ Orphaned data temizleme
5. ✅ CleanupLog kaydı

### Faz 4: Cron API Endpoints

**Dosyalar:**

- `app/api/cron/rss-scan/route.ts` (Yeni)
- `app/api/cron/cleanup/route.ts` (Yeni)

**Görevler:**

1. ✅ RSS tarama endpoint'i
2. ✅ Cleanup endpoint'i
3. ✅ API key authentication
4. ✅ Rate limiting
5. ✅ Error handling ve logging

### Faz 5: GitHub Actions Workflow

**Dosyalar:**

- `.github/workflows/rss-scan.yml` (Yeni)
- `.github/workflows/cleanup.yml` (Yeni)

**Görevler:**

1. ✅ RSS tarama workflow (her 2 saatte bir)
2. ✅ Cleanup workflow (günde bir)
3. ✅ Secret management (API keys)
4. ✅ Notification sistemi (başarısız durumlar için)
5. ✅ Manual trigger desteği

### Faz 6: Monitoring ve Raporlama

**Dosyalar:**

- `app/admin/automation/page.tsx` (Yeni)
- `app/api/automation/stats/route.ts` (Yeni)

**Görevler:**

1. ✅ Otomasyon dashboard'u
2. ✅ Tarama istatistikleri
3. ✅ Cleanup raporları
4. ✅ Hata logları görüntüleme
5. ✅ Manuel trigger butonları

---

## 🔐 Güvenlik Önlemleri

### API Key Authentication

```typescript
// Cron endpoint'leri için
const CRON_SECRET = process.env.CRON_SECRET

if (request.headers.get("Authorization") !== `Bearer ${CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### Rate Limiting

```typescript
// IP bazlı rate limiting
const rateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 dakika
  max: 5, // Maksimum 5 istek
})
```

### Environment Variables

```env
# .env
CRON_SECRET=<güvenli-random-string>
CLEANUP_RETENTION_DAYS=30
RSS_ITEM_RETENTION_DAYS=7
DRAFT_RETENTION_DAYS=90
```

---

## 📈 Performans Optimizasyonları

### 1. Batch Processing

```typescript
// Paralel işleme (max 3 feed aynı anda)
const BATCH_SIZE = 3
for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
  const batch = feeds.slice(i, i + BATCH_SIZE)
  await Promise.allSettled(batch.map((feed) => scanRssFeed(feed.id)))
}
```

### 2. Incremental Scanning

```typescript
// Sadece son taramadan sonraki öğeleri işle
const lastItemDate = feed.lastItemDate || new Date(0)
const newItems = items.filter((item) => item.pubDate > lastItemDate)
```

### 3. Database Indexing

```prisma
@@index([rssFeedId, pubDate])
@@index([processed, createdAt])
@@index([urlHash])
```

---

## 🧪 Test Stratejisi

### Unit Tests

```typescript
// lib/rss/__tests__/enhanced-scanner.test.ts
describe("Enhanced RSS Scanner", () => {
  test("should detect duplicates by URL hash", async () => {
    // ...
  })

  test("should perform incremental scan", async () => {
    // ...
  })
})
```

### Integration Tests

```typescript
// app/api/cron/__tests__/rss-scan.test.ts
describe("Cron RSS Scan API", () => {
  test("should require authentication", async () => {
    // ...
  })

  test("should scan all active feeds", async () => {
    // ...
  })
})
```

### Manual Testing

1. ✅ GitHub Actions workflow manuel tetikleme
2. ✅ Cron endpoint'lerini Postman ile test
3. ✅ Admin dashboard'da istatistikleri kontrol
4. ✅ Veritabanında temizleme sonuçlarını doğrulama

---

## 📅 Zaman Çizelgesi

| Faz                      | Süre         | Durum        |
| ------------------------ | ------------ | ------------ |
| Faz 1: Veritabanı Şeması | 1 saat       | ⏳ Beklemede |
| Faz 2: Enhanced Scanner  | 2 saat       | ⏳ Beklemede |
| Faz 3: Cleanup Service   | 1.5 saat     | ⏳ Beklemede |
| Faz 4: Cron Endpoints    | 1.5 saat     | ⏳ Beklemede |
| Faz 5: GitHub Actions    | 1 saat       | ⏳ Beklemede |
| Faz 6: Monitoring        | 1.5 saat     | ⏳ Beklemede |
| Test ve Dokümantasyon    | 1.5 saat     | ⏳ Beklemede |
| **Toplam**               | **~10 saat** |              |

---

## 🎯 Başarı Kriterleri

### Fonksiyonel Gereksinimler

- ✅ GitHub Actions her 2 saatte bir otomatik çalışıyor
- ✅ RSS feedleri başarıyla taranıyor
- ✅ AI ile içerik üretiliyor
- ✅ Veritabanına kaydediliyor
- ✅ Eski veriler otomatik temizleniyor

### Performans Gereksinimleri

- ✅ Tek feed taraması < 5 dakika
- ✅ Tüm feedler taraması < 30 dakika
- ✅ Duplicate kontrolü < 1 saniye
- ✅ Cleanup işlemi < 2 dakika

### Güvenilirlik Gereksinimleri

- ✅ %95+ uptime
- ✅ Hata durumunda retry
- ✅ Detaylı error logging
- ✅ Notification sistemi

---

## 📝 Notlar

### Vercel Deployment Considerations

- Vercel Hobby plan: 10 saniye timeout (serverless functions)
- Vercel Pro plan: 60 saniye timeout
- Cron job'lar için external trigger kullanılmalı (GitHub Actions)
- Long-running tasks için async pattern kullanılmalı

### Database Considerations

- Neon PostgreSQL free tier: 0.5 GB storage
- Düzenli cleanup kritik
- Index'ler performans için önemli
- Connection pooling kullanılmalı

### AI API Considerations

- Google Gemini API rate limits
- Batch processing ile optimize edilmeli
- Retry mekanizması olmalı
- Cost monitoring önemli

---

## 🔄 Gelecek Geliştirmeler

### Kısa Vadeli (1-2 hafta)

- [ ] Webhook sistemi (RSS feed güncellendiğinde)
- [ ] Email notifications (hata durumlarında)
- [ ] Advanced analytics dashboard
- [ ] RSS feed health monitoring

### Orta Vadeli (1-2 ay)

- [ ] Machine learning bazlı feed önceliklendirme
- [ ] Otomatik feed discovery
- [ ] Multi-language support
- [ ] Advanced caching stratejileri

### Uzun Vadeli (3-6 ay)

- [ ] Distributed task queue (BullMQ)
- [ ] Microservices architecture
- [ ] Real-time processing
- [ ] Advanced AI features (image generation, video processing)

---

## 📚 Referanslar

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Google Gemini API](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Son Güncelleme**: 16 Kasım 2025  
**Durum**: ✅ Plan Hazır - Geliştirme Başlayabilir
