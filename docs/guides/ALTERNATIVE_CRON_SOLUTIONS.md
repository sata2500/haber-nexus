# RSS Feed Otomatik Tarama - Alternatif Çözümler

## Sorun

Vercel Hobby plan'da cron job limiti:

- Maksimum 2 cron job
- Günde sadece 1 kez çalışabilir
- Bizim ihtiyacımız: Her 15 dakikada RSS tarama

## Alternatif Çözümler

### ✅ Çözüm 1: Harici Ücretsiz Cron Servisleri (ÖNERİLEN)

**Servisler:**

1. **cron-job.org** (Ücretsiz)
   - 50 cron job
   - 1 dakika interval
   - HTTPS destekli
   - Ücretsiz ve güvenilir

2. **EasyCron** (Ücretsiz tier)
   - 1 cron job (ücretsiz)
   - 1 dakika interval
   - Email bildirimleri

3. **UptimeRobot** (Ücretsiz)
   - 50 monitor
   - 5 dakika interval
   - HTTP(S) monitoring

**Avantajlar:**

- ✅ Tamamen ücretsiz
- ✅ Vercel limitlerini aşmıyor
- ✅ Kolay kurulum
- ✅ Güvenilir
- ✅ Kod değişikliği gerektirmiyor

**Dezavantajlar:**

- ⚠️ Harici servise bağımlılık
- ⚠️ Servis down olursa tarama durur

**Uygulama:**

1. cron-job.org'a kaydol
2. Yeni cron job oluştur:
   - URL: `https://habernexus.com/api/cron/scan-rss-feeds`
   - Header: `Authorization: Bearer YOUR_CRON_SECRET`
   - Schedule: Her 15 dakikada
3. Bitti!

---

### ✅ Çözüm 2: GitHub Actions (ÖNERİLEN)

**Açıklama:**
GitHub Actions ile scheduled workflow oluştur, API endpoint'i tetikle.

**Avantajlar:**

- ✅ Tamamen ücretsiz
- ✅ GitHub'da zaten var
- ✅ Güvenilir
- ✅ Vercel limitlerini aşmıyor
- ✅ Kod repository'de

**Dezavantajlar:**

- ⚠️ Minimum interval: 5 dakika
- ⚠️ GitHub Actions kullanımı gerekli

**Uygulama:**
`.github/workflows/rss-scan.yml` dosyası oluştur:

```yaml
name: RSS Feed Auto Scan

on:
  schedule:
    # Her 15 dakikada bir çalışır
    - cron: "*/15 * * * *"
  workflow_dispatch: # Manuel tetikleme için

jobs:
  scan-rss-feeds:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger RSS Scan
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://habernexus.com/api/cron/scan-rss-feeds
```

---

### ✅ Çözüm 3: Vercel Cron + Manuel Tetikleme Kombine

**Açıklama:**

- Vercel cron: Günde 1 kez (gece 2'de)
- Manuel tetikleme: Admin dashboard'dan

**Avantajlar:**

- ✅ Vercel native
- ✅ Kod değişikliği minimal
- ✅ Ücretsiz

**Dezavantajlar:**

- ⚠️ Tam otomatik değil
- ⚠️ Günde sadece 1 otomatik tarama

**Uygulama:**

1. `vercel.json`'da schedule'ı değiştir: `0 2 * * *` (her gece 2'de)
2. Admin dashboard'a "Tüm Feed'leri Tara" butonu ekle
3. Kullanıcı gerektiğinde manuel tetikler

---

### ✅ Çözüm 4: Cloudflare Workers (Ücretsiz Tier)

**Açıklama:**
Cloudflare Workers ile scheduled task oluştur.

**Avantajlar:**

- ✅ Ücretsiz tier: 100,000 request/gün
- ✅ Cron Triggers ücretsiz
- ✅ Güvenilir

**Dezavantajlar:**

- ⚠️ Cloudflare hesabı gerekli
- ⚠️ Worker kodu yazma gerekli

---

### ❌ Çözüm 5: Vercel Pro Plan (Ücretli)

**Maliyet:** $20/ay

**Avantajlar:**

- ✅ 40 cron job
- ✅ Unlimited schedule
- ✅ Garantili timing

**Dezavantajlar:**

- ❌ Ücretli ($20/ay)

---

## Önerilen Çözüm: GitHub Actions + cron-job.org

### Neden?

1. **Tamamen ücretsiz**
2. **Güvenilir** (GitHub ve cron-job.org ikisi de güvenilir)
3. **Kolay kurulum**
4. **Backup mekanizması** (biri fail olursa diğeri çalışır)

### Kurulum Planı

#### 1. GitHub Actions (Primary)

- Her 15 dakikada otomatik tetikleme
- GitHub repository'de workflow dosyası
- CRON_SECRET GitHub Secrets'a ekle

#### 2. cron-job.org (Backup)

- Aynı endpoint'i tetikle
- GitHub Actions fail olursa devreye girer
- Email bildirimleri

### Avantajlar

- ✅ Çift güvenlik (redundancy)
- ✅ Tamamen ücretsiz
- ✅ Vercel limitlerini aşmıyor
- ✅ Kod değişikliği minimal
- ✅ Monitoring ve alerting

---

## Karar: GitHub Actions Kullanacağız

**Seçilen Çözüm:** GitHub Actions

**Sebep:**

- Tamamen ücretsiz
- GitHub'da zaten var
- Güvenilir
- Kod repository'de (version control)
- Kolay kurulum
- Manuel tetikleme de mevcut

**Uygulama Adımları:**

1. `.github/workflows/rss-scan.yml` oluştur
2. GitHub Secrets'a `CRON_SECRET` ekle
3. Test et
4. Deploy et

**Yedek Plan:**
Eğer GitHub Actions'da sorun olursa cron-job.org kullanırız.
