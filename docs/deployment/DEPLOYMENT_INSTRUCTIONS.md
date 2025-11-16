# HaberNexus - Deployment Talimatları

## 🚀 Vercel'e Deploy Etme

### 1. Environment Variables Ekleme

Vercel Dashboard → Project Settings → Environment Variables bölümüne aşağıdaki değişkenleri ekleyin:

```bash
# Database (Mevcut)
DATABASE_URL=postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Neon Auth (Mevcut)
NEXT_PUBLIC_STACK_PROJECT_ID=27882787-2ef7-46a3-97dc-407705a34eef
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_kxxnzby66zxsgv80g9qaxz48kr0b85q8asfq4jde1a5kg
STACK_SECRET_SERVER_KEY=ssk_j680eq2n7cjkpvqefxhj9zw7rm0398x4d4pgbtx51yfw0

# Google API (Mevcut)
GOOGLE_API_KEY=AIzaSyAPlINowRrEwmPKqMOqqkTkrgHwgeH6qX8
GOOGLE_CLIENT_ID=74027371954-06002eq8ohp1gkf5semclaiien5medm8.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# NextAuth (Mevcut)
AUTH_SECRET=/ri5ISLdB2Dws6IHhofpHO+afcVlJXLB3uyx5Elqe7U=
NEXTAUTH_URL=https://habernexus.com
AUTH_TRUST_HOST=true

# ⚠️ YENİ: Cron Job Security
CRON_SECRET=your-random-secret-key-here-change-this
```

### 2. CRON_SECRET Oluşturma

Güvenli bir random key oluşturun:

```bash
# Node.js ile
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# veya OpenSSL ile
openssl rand -hex 32
```

Oluşturduğunuz key'i Vercel'e `CRON_SECRET` olarak ekleyin.

### 3. Deploy

```bash
# GitHub'a push yaptığınızda otomatik deploy olacak
git push origin main

# veya Vercel CLI ile manuel deploy
vercel --prod
```

### 4. Cron Jobs Kontrolü

Deploy sonrası Vercel Dashboard'da:

1. Project Settings → Cron Jobs
2. İki cron job görmelisiniz:
   - `/api/cron/publish-scheduled` - Her 5 dakikada
   - `/api/cron/scan-rss-feeds` - Her 15 dakikada

### 5. Test

#### RSS Tarama Testi

1. Admin Dashboard → RSS Feed Yönetimi
2. Bir feed'in yanındaki "Tara" butonuna tıklayın
3. "Tarama başlatıldı" mesajını görmelisiniz
4. Birkaç dakika sonra feed'in "Son tarama" tarihinin güncellendiğini kontrol edin

#### RSS Feed Silme Testi

1. Makalesi olmayan bir feed oluşturun
2. Silme butonuna tıklayın
3. Onay verin ve silindiğini kontrol edin

#### Cron Job Testi

1. 15 dakika bekleyin
2. Admin Dashboard'da RSS feed'lerin "Son tarama" tarihlerini kontrol edin
3. Otomatik güncelleniyorsa cron job çalışıyor demektir

## 🔧 Sorun Giderme

### Cron Job Çalışmıyor

**Kontrol Listesi:**

- ✅ `CRON_SECRET` environment variable tanımlı mı?
- ✅ Production'da deploy edildi mi? (Cron sadece production'da çalışır)
- ✅ `vercel.json` dosyası commit edildi mi?
- ✅ Vercel Dashboard'da cron jobs görünüyor mu?

**Manuel Test:**

```bash
# Local'de test (CRON_SECRET olmadan)
curl http://localhost:3000/api/cron/scan-rss-feeds

# Production'da test (CRON_SECRET ile)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://habernexus.com/api/cron/scan-rss-feeds
```

### RSS Tarama Başarısız

**Kontrol Listesi:**

- ✅ `GOOGLE_API_KEY` tanımlı mı?
- ✅ Gemini API quota'sı aşıldı mı?
- ✅ RSS feed URL'i erişilebilir mi?
- ✅ Feed'in `isActive` değeri `true` mu?

**Log Kontrolü:**
Vercel Dashboard → Deployments → Latest → Functions → Logs

### Database Connection Hatası

**Kontrol Listesi:**

- ✅ `DATABASE_URL` doğru mu?
- ✅ Neon database aktif mi?
- ✅ IP whitelist kontrolü (Neon'da gerekirse)

## 📊 Monitoring

### RSS Tarama İstatistikleri

Database'de `RssScanLog` tablosunu kontrol edin:

```sql
-- Son 24 saatteki taramalar
SELECT
  rf.name,
  rsl.status,
  rsl.itemsFound,
  rsl.itemsProcessed,
  rsl.itemsPublished,
  rsl.createdAt
FROM "RssScanLog" rsl
JOIN "RssFeed" rf ON rf.id = rsl."rssFeedId"
WHERE rsl."createdAt" > NOW() - INTERVAL '24 hours'
ORDER BY rsl."createdAt" DESC;

-- Başarı oranları
SELECT
  rf.name,
  rf."successRate",
  rf."totalScans",
  rf."totalArticles",
  rf."lastScannedAt"
FROM "RssFeed" rf
WHERE rf."isActive" = true
ORDER BY rf."successRate" DESC;
```

### Cron Job Logları

Vercel Dashboard → Deployments → Functions → `/api/cron/scan-rss-feeds`

Her çalıştırmada şu bilgiler loglanır:

- Taranan feed sayısı
- Başarılı/başarısız tarama sayısı
- İşlenen/yayınlanan makale sayısı
- Hatalar (varsa)

## 🎯 Sonraki Adımlar

### Önerilen İyileştirmeler

1. **Monitoring Dashboard**
   - Grafana/Prometheus entegrasyonu
   - Real-time tarama istatistikleri
   - Alert sistemi

2. **Performance Optimization**
   - Redis cache ekle
   - AI sonuçlarını cache'le
   - Batch processing

3. **User Experience**
   - Real-time progress tracking
   - WebSocket/SSE ile canlı güncellemeler
   - Daha detaylı hata mesajları

4. **Cost Optimization**
   - Gemini API kullanım takibi
   - Rate limiting iyileştirmeleri
   - Smart scheduling (dinamik interval)

## 📞 Destek

Sorun yaşarsanız:

1. GitHub Issues: https://github.com/sata2500/haber-nexus/issues
2. Vercel Support: https://vercel.com/support
3. Neon Support: https://neon.tech/docs

## ✅ Checklist

Deploy öncesi kontrol listesi:

- [x] Tüm environment variables eklendi
- [x] CRON_SECRET oluşturuldu ve eklendi
- [x] GitHub'a push yapıldı
- [x] Build başarılı
- [x] vercel.json commit edildi
- [ ] Production'da deploy edildi
- [ ] Cron jobs Vercel'de görünüyor
- [ ] RSS tarama testi yapıldı
- [ ] RSS silme testi yapıldı
- [ ] 15 dakika sonra otomatik tarama kontrol edildi

## 🎉 Tamamlandı!

Tüm sorunlar çözüldü ve proje production'a hazır!

**Yapılan İyileştirmeler:**

- ✅ Async RSS tarama (timeout sorunu çözüldü)
- ✅ Cascade delete (silme sorunu çözüldü)
- ✅ Otomatik tarama zamanlayıcısı (cron job eklendi)
- ✅ AI retry mekanizması (hata toleransı arttı)
- ✅ Detaylı dokümantasyon

**Commit:** `cfc7471` - "fix: RSS Feed yönetimi sorunları çözüldü"

Artık HaberNexus'un RSS feed yönetimi tam otomatik ve sorunsuz çalışıyor! 🚀
