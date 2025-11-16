# RSS Feed Tarama Timeout Sorunu - Araştırma Bulguları

## Kaynak

- **URL:** https://vercel.com/docs/functions/configuring-functions/duration
- **Tarih:** 15 Kasım 2025

## Vercel Function Duration Limits

### Hobby Plan (Mevcut Plan)

- **Default:** 300s (5 dakika)
- **Maximum:** 300s (5 dakika)
- **Fluid Compute:** Enabled by default

### Pro Plan

- **Default:** 300s (5 dakika)
- **Maximum:** 800s (13 dakika)

### Enterprise Plan

- **Default:** 300s (5 dakika)
- **Maximum:** 800s (13 dakika)

## Sorunun Kök Nedeni

### 1. Frontend Hala `/scan` Kullanıyor

- Kullanıcı hala senkron `/scan` endpoint'ini kullanıyor
- Bu endpoint timeout'a düşüyor
- `/scan-async` endpoint'i kullanılmalı

### 2. Vercel Function Timeout

- Hobby plan: Maximum 300 saniye (5 dakika)
- AI işleme süresi: 8 AI çağrısı × 10-30 saniye = 80-240 saniye per makale
- 2-3 makale işlenirse timeout'a düşüyor

### 3. maxDuration Ayarı Eksik

- Next.js 13.5+ için `export const maxDuration = 300` eklenmeli
- Şu anda default 10 saniye kullanılıyor olabilir

## Çözümler

### Çözüm 1: maxDuration Ekle (Geçici)

```typescript
// app/api/rss-feeds/[id]/scan/route.ts
export const maxDuration = 300 // 5 dakika (Hobby plan max)
```

**Avantajlar:**

- Hızlı çözüm
- Kod değişikliği minimal

**Dezavantajlar:**

- Hala timeout riski var (5+ makale varsa)
- Kullanıcı uzun süre bekler

### Çözüm 2: Async Endpoint Kullan (ÖNERİLEN)

```typescript
// Frontend'de /scan-async kullan
const response = await fetch(`/api/rss-feeds/${feedId}/scan-async`, {
  method: "POST",
})
```

**Avantajlar:**

- Timeout sorunu %100 çözülür
- Kullanıcı hemen yanıt alır
- Background'da işlem devam eder

**Dezavantajlar:**

- Frontend değişikliği gerekli (zaten yapıldı ama deploy edilmedi)

### Çözüm 3: Batch Processing

- Her seferinde maksimum 3 makale işle
- Kalan makaleleri sonraki çalıştırmada işle

### Çözüm 4: AI Çağrılarını Optimize Et

- Paralel AI çağrıları (bazıları bağımsız)
- Cache kullan (aynı içerik tekrar işlenmesin)
- Gereksiz çağrıları kaldır

## Uygulama Planı

### 1. maxDuration Ekle (Tüm Scan Endpoint'lerine)

```typescript
// app/api/rss-feeds/[id]/scan/route.ts
export const maxDuration = 300

// app/api/rss-feeds/[id]/scan-async/route.ts
export const maxDuration = 300

// app/api/cron/scan-rss-feeds/route.ts
export const maxDuration = 300
```

### 2. Frontend'i Redeploy Et

- Zaten `/scan-async` kullanacak şekilde değiştirildi
- Ama production'da hala eski kod çalışıyor
- Redeploy gerekli

### 3. GitHub Actions CRON_SECRET Ekle

- GitHub Actions 500 hatası alıyor
- CRON_SECRET eksik veya yanlış

## Sonuç

**Ana Sorun:** Frontend hala `/scan` endpoint'ini kullanıyor (eski kod)

**Çözüm:**

1. `maxDuration = 300` ekle (tüm scan endpoint'lerine)
2. Vercel'e redeploy yap (yeni frontend kodu deploy edilsin)
3. GitHub Actions için CRON_SECRET ekle

**Beklenen Sonuç:**

- Frontend `/scan-async` kullanacak
- Timeout sorunu çözülecek
- GitHub Actions çalışacak
