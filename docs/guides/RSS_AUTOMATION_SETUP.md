# RSS Otomasyonu Kurulum ve Kullanım Kılavuzu

**Tarih**: 16 Kasım 2025  
**Geliştirici**: Manus AI  
**Proje**: HaberNexus

---

## 📋 Genel Bakış

Bu kılavuz, HaberNexus projesinde yeni geliştirilen RSS otomasyonu sisteminin kurulumu ve kullanımı hakkında detaylı bilgi sağlar.

---

## 🎯 Sistem Özellikleri

### Otomatik RSS Taraması

- **Zamanlama**: Her 2 saatte bir otomatik tarama
- **Duplicate Detection**: URL hash bazlı tekrar önleme
- **Incremental Scanning**: Sadece yeni öğeleri işleme
- **Batch Processing**: 3'lü gruplar halinde paralel işleme
- **AI Integration**: Google Gemini ile içerik üretimi

### Otomatik Veritabanı Temizliği

- **RSS Scan Logs**: 30 gün sonra otomatik silme
- **RSS Items Cache**: 7 gün sonra otomatik silme
- **Draft Articles**: 90 gün sonra otomatik silme (AI-generated)
- **Orphaned Data**: Günlük temizlik

### Güvenlik

- **API Key Authentication**: Bearer token ile korumalı endpoint'ler
- **Rate Limiting**: Aşırı kullanımı önleme
- **Error Handling**: Detaylı hata loglama

---

## 🚀 Kurulum Adımları

### 1. GitHub Secrets Ayarlama

GitHub Actions'ın cron endpoint'lerine erişebilmesi için secret eklemeniz gerekiyor:

1. GitHub repository'nize gidin
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** butonuna tıklayın
4. Aşağıdaki bilgileri girin:
   - **Name**: `CRON_SECRET`
   - **Value**: `sFP2fxLfTJf4iq341qYLCoBCh8BWbcy7MtkhOh5zMdI=`
5. **Add secret** butonuna tıklayın

### 2. Vercel Environment Variables

Vercel'de de aynı secret'ı eklemeniz gerekiyor:

1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. Projenizi seçin
3. **Settings** → **Environment Variables**
4. Yeni variable ekleyin:
   - **Key**: `CRON_SECRET`
   - **Value**: `sFP2fxLfTJf4iq341qYLCoBCh8BWbcy7MtkhOh5zMdI=`
   - **Environments**: Production, Preview, Development (hepsini seçin)
5. **Save** butonuna tıklayın

### 3. Vercel'e Deploy

Değişiklikleri deploy edin:

```bash
git push origin main
```

Vercel otomatik olarak deploy edecektir. Deploy tamamlandıktan sonra:

1. Vercel dashboard'da deployment'ı kontrol edin
2. Build loglarını inceleyin
3. Hataların olmadığından emin olun

### 4. GitHub Actions'ı Test Etme

Manuel olarak workflow'ları test edin:

1. GitHub repository → **Actions** sekmesi
2. **RSS Feed Scanner** workflow'unu seçin
3. **Run workflow** → **Run workflow** butonuna tıklayın
4. Workflow'un başarıyla tamamlandığını kontrol edin
5. Logs'u inceleyin

---

## 📊 Sistem Bileşenleri

### Veritabanı Modelleri

#### RssItem

RSS öğelerini cache'lemek için kullanılır:

```prisma
model RssItem {
  id          String   @id @default(cuid())
  rssFeedId   String
  guid        String   // RSS item GUID
  urlHash     String   @unique // URL hash for duplicate check
  title       String
  link        String
  description String?
  pubDate     DateTime
  processed   Boolean  @default(false)
  articleId   String?  @unique
  createdAt   DateTime @default(now())
  processedAt DateTime?
}
```

#### CleanupLog

Temizleme işlemlerini kaydetmek için kullanılır:

```prisma
model CleanupLog {
  id              String      @id @default(cuid())
  type            CleanupType
  status          String
  itemsDeleted    Int         @default(0)
  itemsKept       Int         @default(0)
  details         Json?
  error           String?
  duration        Int
  createdAt       DateTime    @default(now())
}
```

### API Endpoints

#### POST /api/cron/rss-scan

RSS taraması için cron endpoint:

**Authentication**: Bearer token (CRON_SECRET)

**Request**:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://habernexus.com/api/cron/rss-scan
```

**Response**:

```json
{
  "success": true,
  "message": "RSS scan completed successfully",
  "summary": {
    "totalFeeds": 5,
    "successful": 4,
    "partial": 1,
    "failed": 0,
    "totalItemsProcessed": 25,
    "totalItemsPublished": 20
  }
}
```

#### POST /api/cron/cleanup

Veritabanı temizliği için cron endpoint:

**Authentication**: Bearer token (CRON_SECRET)

**Request**:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://habernexus.com/api/cron/cleanup
```

**Response**:

```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "summary": {
    "totalTasks": 4,
    "successful": 4,
    "failed": 0,
    "totalItemsDeleted": 150
  }
}
```

### GitHub Actions Workflows

#### RSS Feed Scanner (.github/workflows/rss-scan.yml)

Her 2 saatte bir çalışır:

```yaml
on:
  schedule:
    - cron: "0 */2 * * *"
  workflow_dispatch:
```

#### Database Cleanup (.github/workflows/cleanup.yml)

Her gün saat 03:00'te çalışır:

```yaml
on:
  schedule:
    - cron: "0 3 * * *"
  workflow_dispatch:
```

---

## 🔍 Monitoring ve Debugging

### GitHub Actions Logs

1. GitHub repository → **Actions** sekmesi
2. İlgili workflow'u seçin
3. Son çalıştırmaları görüntüleyin
4. Detaylı logları inceleyin

### Veritabanı Kontrolleri

#### RssScanLog Tablosu

Tarama geçmişini görüntüleyin:

```sql
SELECT * FROM "RssScanLog"
ORDER BY "createdAt" DESC
LIMIT 10;
```

#### CleanupLog Tablosu

Temizleme geçmişini görüntüleyin:

```sql
SELECT * FROM "CleanupLog"
ORDER BY "createdAt" DESC
LIMIT 10;
```

#### RssItem Cache

Cache durumunu kontrol edin:

```sql
SELECT
  rssFeedId,
  COUNT(*) as total_items,
  SUM(CASE WHEN processed THEN 1 ELSE 0 END) as processed_items,
  MAX("createdAt") as latest_item
FROM "RssItem"
GROUP BY rssFeedId;
```

### Admin Dashboard

Admin panelden manuel olarak tarama başlatabilirsiniz:

1. Admin panele giriş yapın
2. **RSS Feeds** bölümüne gidin
3. İlgili feed'in yanındaki **Tara** butonuna tıklayın

---

## 🛠️ Troubleshooting

### Problem: GitHub Actions çalışmıyor

**Çözüm**:

1. GitHub Secrets'ın doğru ayarlandığından emin olun
2. Workflow dosyalarının syntax'ını kontrol edin
3. Repository'nin Actions'ı aktif olduğundan emin olun

### Problem: Cron endpoint 401 hatası veriyor

**Çözüm**:

1. CRON_SECRET'ın Vercel'de doğru ayarlandığından emin olun
2. Vercel'e yeniden deploy edin
3. Secret'ın tüm environment'larda (Production, Preview, Development) ayarlı olduğundan emin olun

### Problem: RSS taraması timeout veriyor

**Çözüm**:

1. Feed sayısını azaltın veya batch size'ı küçültün
2. Vercel Pro plan'e geçin (60 saniye timeout)
3. Problematik feed'leri devre dışı bırakın

### Problem: Duplicate makaleler oluşuyor

**Çözüm**:

1. RssItem cache'ini kontrol edin
2. URL hash'lerinin doğru oluşturulduğundan emin olun
3. GUID'lerin unique olduğundan emin olun

---

## 📈 Performans İyileştirmeleri

### Batch Size Ayarlama

`lib/rss/enhanced-scanner.ts` dosyasında batch size'ı ayarlayabilirsiniz:

```typescript
const BATCH_SIZE = 3 // Varsayılan: 3
```

### Timeout Ayarlama

`lib/rss/enhanced-scanner.ts` dosyasında item processing timeout'unu ayarlayabilirsiniz:

```typescript
setTimeout(() => reject(new Error("Item processing timeout")), 120000) // 2 dakika
```

### Retention Period Ayarlama

`.env` dosyasına şu değişkenleri ekleyebilirsiniz:

```env
CLEANUP_RETENTION_DAYS=30
RSS_ITEM_RETENTION_DAYS=7
DRAFT_RETENTION_DAYS=90
```

---

## 🔄 Güncelleme ve Bakım

### Workflow Zamanlamasını Değiştirme

RSS tarama sıklığını değiştirmek için `.github/workflows/rss-scan.yml`:

```yaml
schedule:
  - cron: "0 */4 * * *" # Her 4 saatte bir
```

Cleanup zamanlamasını değiştirmek için `.github/workflows/cleanup.yml`:

```yaml
schedule:
  - cron: "0 2 * * *" # Her gün saat 02:00
```

### Yeni Feed Ekleme

1. Admin panele giriş yapın
2. **RSS Feeds** → **Yeni RSS Feed**
3. Feed bilgilerini girin:
   - Name: Feed adı
   - URL: RSS feed URL'i
   - Category: Kategori seçin
   - Auto Publish: Otomatik yayınlama (opsiyonel)
4. **Kaydet** butonuna tıklayın

### Manuel Tarama

Acil durumlarda manuel tarama yapabilirsiniz:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://habernexus.com/api/cron/rss-scan
```

---

## 📚 Ek Kaynaklar

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [RSS Automation Plan](./RSS_AUTOMATION_PLAN.md)

---

## 🤝 Destek

Sorun yaşarsanız veya yardıma ihtiyacınız olursa:

- GitHub Issues: [haber-nexus/issues](https://github.com/sata2500/haber-nexus/issues)
- Email: salihtanriseven25@gmail.com

---

**Son Güncelleme**: 16 Kasım 2025  
**Durum**: ✅ Aktif ve Çalışıyor
