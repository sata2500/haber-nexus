# İçerik Silme Sorunu Analizi

**Tarih**: 16 Kasım 2025  
**Sorun**: Oluşturulan içerikler (haber/makale) otomatik olarak siliniyormuş gibi görünüyor

---

## Mevcut Cleanup Sistemi

### 1. Cleanup Service (`lib/services/cleanup-service.ts`)

Sistemde 4 farklı cleanup fonksiyonu var:

#### a) `cleanupRssScanLogs()` - RSS Tarama Logları

- **Retention**: 30 gün
- **Silinecekler**: 30 günden eski RSS tarama logları
- **Etkilenen Tablo**: `RssScanLog`
- **✅ Durum**: Bu DOĞRU - loglar silinmeli

#### b) `cleanupRssItems()` - RSS Öğeleri

- **Retention**: 7 gün
- **Silinecekler**: 7 günden eski, işlenmiş RSS öğeleri
- **Etkilenen Tablo**: `RssItem`
- **✅ Durum**: Bu DOĞRU - RSS cache silinmeli

#### c) `cleanupDraftArticles()` - Taslak Makaleler

- **Retention**: 90 gün
- **Silinecekler**: 90 günden eski, AI tarafından oluşturulmuş TASLAK makaleler
- **Etkilenen Tablo**: `Article` (status = "DRAFT", aiGenerated = true)
- **⚠️ SORUN**: Bu YANLIŞ - yayınlanmış makaleler silinmemeli

**Kod**:

```typescript
const result = await prisma.article.deleteMany({
  where: {
    status: "DRAFT",
    aiGenerated: true,
    createdAt: {
      lt: cutoffDate,
    },
  },
})
```

**Analiz**: Bu fonksiyon sadece TASLAK makaleleri siliyor, yayınlanmış makaleleri silmiyor. ✅ DOĞRU

#### d) `cleanupOrphanedData()` - Yetim Veriler

- **Retention**: 1 gün
- **Silinecekler**: İşlenmiş ama makale oluşturulmamış RSS öğeleri
- **Etkilenen Tablo**: `RssItem` (processed = true, articleId = null)
- **✅ Durum**: Bu DOĞRU - yetim kayıtlar silinmeli

### 2. Cleanup Cron Job (`app/api/cron/cleanup/route.ts`)

- **Tetikleme**: GitHub Actions ile günlük
- **Çalıştırılan Fonksiyonlar**: `runAllCleanupTasks()`
  - cleanupRssScanLogs(30)
  - cleanupRssItems(7)
  - cleanupDraftArticles(90)
  - cleanupOrphanedData()

---

## Sorun Analizi

### Olası Senaryo 1: Yayınlanmış Makaleler Silinmiyor ✅

Kod incelemesine göre, **yayınlanmış makaleler silinmiyor**. `cleanupDraftArticles()` fonksiyonu sadece:

- `status = "DRAFT"` olan
- `aiGenerated = true` olan
- 90 günden eski makaleleri siliyor

**Sonuç**: Yayınlanmış makaleler (`status = "PUBLISHED"`) hiçbir zaman silinmiyor.

### Olası Senaryo 2: RSS Öğeleri Siliniyor (Doğru Davranış) ✅

`cleanupRssItems()` fonksiyonu 7 günden eski RSS öğelerini siliyor. Bu DOĞRU bir davranış çünkü:

- RSS öğeleri sadece bir cache
- Makale zaten oluşturulmuş (`articleId` bağlantısı var)
- Eski RSS öğelerini tutmanın bir anlamı yok

### Olası Senaryo 3: Kullanıcı Yanlış Anlama

Kullanıcı muhtemelen şunlardan birini gözlemlemiş olabilir:

1. **RSS öğelerinin silinmesi** → Bu normal, makaleler silinmiyor
2. **Taslak makalelerin silinmesi** → Bu normal, sadece taslaklar siliniyor
3. **Veritabanı bağlantı sorunu** → Makaleler görünmüyor ama silinmemiş

---

## Çözüm Önerileri

### 1. Yayınlanmış Makalelerin Korunması (Zaten Mevcut) ✅

Mevcut kod zaten yayınlanmış makaleleri koruyor. Ek bir değişiklik gerekmez.

### 2. RSS Öğelerinin Korunması (İsteğe Bağlı)

Eğer kullanıcı RSS öğelerinin silinmesini istemiyorsa, `cleanupRssItems()` fonksiyonunu devre dışı bırakabiliriz veya retention süresini artırabiliriz.

**Öneri**: Retention süresini 7 günden 30 güne çıkar.

### 3. Taslak Makalelerin Korunması (İsteğe Bağlı)

Eğer kullanıcı taslak makalelerin silinmesini istemiyorsa, `cleanupDraftArticles()` fonksiyonunu devre dışı bırakabiliriz veya retention süresini artırabiliriz.

**Öneri**: Retention süresini 90 günden 180 güne çıkar veya tamamen devre dışı bırak.

### 4. Cleanup Konfigürasyonu

Cleanup ayarlarını environment variable'lardan okuyacak şekilde değiştirelim:

```typescript
// .env
CLEANUP_RSS_SCAN_LOGS_RETENTION=30  # days
CLEANUP_RSS_ITEMS_RETENTION=30      # days (7'den 30'a çıkarıldı)
CLEANUP_DRAFT_ARTICLES_RETENTION=180 # days (90'dan 180'e çıkarıldı)
CLEANUP_ORPHANED_DATA_ENABLED=true

# Veya tamamen devre dışı bırak
CLEANUP_DRAFT_ARTICLES_ENABLED=false
```

---

## Uygulama Planı

### Adım 1: Cleanup Ayarlarını Konfigüre Edilebilir Yap

`lib/services/cleanup-service.ts` dosyasını güncelleyerek environment variable'lardan ayarları okuyacak hale getir.

### Adım 2: Varsayılan Ayarları Güncelle

- RSS öğeleri retention: 7 → 30 gün
- Taslak makaleler retention: 90 → 180 gün (veya devre dışı)

### Adım 3: Yayınlanmış Makalelerin Silinmediğini Doğrula

Test scripti ile yayınlanmış makalelerin hiçbir zaman silinmediğini doğrula.

### Adım 4: Dokümantasyon

Cleanup sisteminin nasıl çalıştığını ve hangi ayarların değiştirilebileceğini dokümante et.

---

## Sonuç

**Mevcut Durum**: Yayınlanmış makaleler zaten korunuyor. Sadece taslak makaleler ve RSS cache'i siliniyor.

**Önerilen Değişiklikler**:

1. RSS öğeleri retention: 7 → 30 gün
2. Taslak makaleler retention: 90 → 180 gün (veya devre dışı)
3. Cleanup ayarlarını konfigüre edilebilir yap

**Acil Durum**: Eğer kullanıcı yayınlanmış makalelerin silindiğini düşünüyorsa, bu bir yanlış anlamadır veya başka bir sorun vardır (veritabanı bağlantı sorunu, vb.).
