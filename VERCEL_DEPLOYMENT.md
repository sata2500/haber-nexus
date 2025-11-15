# Vercel Deployment Notları

## ⚠️ Cron Job Limiti

Vercel **Hobby** planında cron job limiti var:
- **Maksimum:** 2 cron job
- **Schedule:** Günde 1 kez
- **Timing:** Belirsiz (örn: 1:00-1:59 arası herhangi bir zaman)

**Pro Plan:**
- 40 cron job
- Unlimited invocations
- Precise timing

## 🔧 Mevcut Çözüm

Cron job yapılandırması kaldırıldı (`vercel.json` silindi).

### Zamanlı Yayın Sistemi

**Manuel Tetikleme:**
1. Admin panelinden manuel olarak cron endpoint'ini çağırın
2. Veya external cron service kullanın (cron-job.org, EasyCron, vb.)

**Endpoint:**
```
POST /api/cron/publish-scheduled
Authorization: Bearer {CRON_SECRET}
```

**Test Endpoint (Admin Only):**
```
GET /api/cron/test-publish
```

## 🎯 Alternatif Çözümler

### Seçenek 1: External Cron Service (ÖNERİLEN)

**Ücretsiz Servisler:**
- [cron-job.org](https://cron-job.org) - Ücretsiz, dakikada 1 kez
- [EasyCron](https://www.easycron.com) - Ücretsiz plan mevcut
- [UptimeRobot](https://uptimerobot.com) - 5 dakikada 1 kez

**Kurulum:**
1. Servise kaydolun
2. Yeni cron job oluşturun
3. URL: `https://habernexus.com/api/cron/publish-scheduled`
4. Method: POST
5. Header: `Authorization: Bearer {CRON_SECRET}`
6. Schedule: Her dakika (`* * * * *`)

**Avantajlar:**
- ✅ Ücretsiz
- ✅ Dakikada 1 kez çalışır
- ✅ Güvenilir
- ✅ Vercel limiti yok

### Seçenek 2: GitHub Actions

**Dosya:** `.github/workflows/scheduled-publish.yml`

```yaml
name: Publish Scheduled Articles

on:
  schedule:
    - cron: '* * * * *'  # Her dakika
  workflow_dispatch:  # Manuel tetikleme

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron Endpoint
        run: |
          curl -X POST https://habernexus.com/api/cron/publish-scheduled \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

**Kurulum:**
1. GitHub repository → Settings → Secrets
2. `CRON_SECRET` ekleyin
3. Workflow dosyasını commit edin

**Avantajlar:**
- ✅ Ücretsiz
- ✅ GitHub entegrasyonu
- ✅ Güvenilir

**Dezavantajlar:**
- ❌ En fazla 5 dakikada 1 kez

### Seçenek 3: Vercel Pro Plan

**Fiyat:** $20/ay

**Avantajlar:**
- ✅ 40 cron job
- ✅ Unlimited invocations
- ✅ Precise timing
- ✅ Native Vercel integration

### Seçenek 4: Manuel Yayınlama

**Kullanım:**
1. Admin panel → Makaleler
2. Zamanlanmış makaleleri görüntüle
3. "Şimdi Yayınla" butonu ile manuel yayınla

**Avantajlar:**
- ✅ Ücretsiz
- ✅ Tam kontrol

**Dezavantajlar:**
- ❌ Otomatik değil
- ❌ Manuel müdahale gerekli

## 🚀 Önerilen Kurulum

**1. Kısa Vadeli (Hemen):**
- External cron service kullanın (cron-job.org)
- 5 dakikada kurulum
- Ücretsiz

**2. Orta Vadeli:**
- GitHub Actions workflow ekleyin
- Backup olarak kullanın

**3. Uzun Vadeli:**
- Vercel Pro plan'a geçin
- Profesyonel kullanım için

## 📝 Kurulum Adımları (cron-job.org)

1. **Kayıt Olun:**
   - https://cron-job.org adresine gidin
   - Ücretsiz hesap oluşturun

2. **Cron Job Oluşturun:**
   - "Create cronjob" butonuna tıklayın
   - Title: "HaberNexus - Publish Scheduled Articles"
   - URL: `https://www.habernexus.com/api/cron/publish-scheduled`
   - Schedule: `* * * * *` (her dakika)

3. **HTTP Headers Ekleyin:**
   - "Advanced" sekmesine gidin
   - Header ekleyin:
     - Name: `Authorization`
     - Value: `Bearer habernexus_cron_secret_2025_secure_key`

4. **Kaydet ve Test Edin:**
   - "Save" butonuna tıklayın
   - "Execute now" ile test edin
   - Logları kontrol edin

## ✅ Doğrulama

**Test Endpoint ile Kontrol:**
```bash
curl -X GET https://www.habernexus.com/api/cron/test-publish \
  -H "Authorization: Bearer {YOUR_SESSION_TOKEN}"
```

**Beklenen Response:**
```json
{
  "message": "Published 2 articles",
  "published": 2,
  "articles": [...],
  "executedBy": "admin@example.com",
  "executedAt": "2025-11-15T10:00:05Z"
}
```

## 🔒 Güvenlik

**CRON_SECRET:**
- Environment variable olarak tanımlı
- Vercel dashboard → Settings → Environment Variables
- Value: `habernexus_cron_secret_2025_secure_key`

**Endpoint Koruması:**
- Bearer token authentication
- Sadece doğru secret ile erişilebilir
- Unauthorized istekler reddediliyor

## 📊 İstatistikler

**Zamanlı Yayın Sistemi:**
- ✅ Fonksiyonel
- ✅ Test edildi
- ✅ Production ready

**Eksik:**
- ❌ Otomatik cron job (Vercel Hobby limit)

**Çözüm:**
- ✅ External cron service (önerilen)
- ✅ GitHub Actions (alternatif)
- ✅ Manuel yayınlama (fallback)

## 🎯 Sonuç

Zamanlı yayın sistemi tam fonksiyonel ancak Vercel Hobby planı nedeniyle otomatik cron job çalışmıyor.

**Hemen Yapılması Gerekenler:**
1. ✅ External cron service kurulumu (cron-job.org)
2. ✅ CRON_SECRET environment variable kontrolü
3. ✅ Test endpoint ile doğrulama

**Opsiyonel:**
- GitHub Actions workflow ekleme
- Vercel Pro plan'a geçiş

---

**Son Güncelleme:** 15 Kasım 2025  
**Durum:** ⚠️ Manuel kurulum gerekli  
**Önerilen Çözüm:** External cron service (cron-job.org)
