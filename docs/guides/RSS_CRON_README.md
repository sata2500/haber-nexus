# RSS Feed Otomatik Tarama - Kurulum Rehberi

## 🚨 Önemli: Vercel Hobby Plan Limiti

Vercel Hobby plan'da cron job limitleri:

- Maksimum 2 cron job
- Günde sadece 1 kez çalışabilir

Bu yüzden **GitHub Actions** kullanıyoruz (tamamen ücretsiz ve sınırsız).

---

## ⚡ Hızlı Kurulum (3 Adım)

### 1️⃣ CRON_SECRET Oluştur

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Çıkan değeri kopyala (örnek: `a1b2c3d4e5f6...`)

### 2️⃣ GitHub Secrets'a Ekle

1. https://github.com/sata2500/haber-nexus/settings/secrets/actions
2. **New repository secret**
3. Name: `CRON_SECRET`, Value: (1. adımda oluşturduğun key)
4. **Add secret**

### 3️⃣ Vercel'e Ekle

1. https://vercel.com → HaberNexus → Settings → Environment Variables
2. Key: `CRON_SECRET`, Value: (aynı key)
3. Environment: Production, Preview, Development (hepsini seç)
4. **Save**

---

## ✅ Test Et

1. https://github.com/sata2500/haber-nexus/actions
2. **RSS Feed Auto Scan** workflow'u
3. **Run workflow** → **Run workflow** (yeşil buton)
4. Logları kontrol et

**Beklenen:** "RSS scan completed successfully!" mesajı

---

## 📅 Çalışma Zamanı

- **Schedule:** Her 15 dakikada
- **Timezone:** UTC (Türkiye UTC+3)
- **İlk çalıştırma:** Manuel tetikle veya 15 dakika bekle

---

## 📚 Detaylı Dokümantasyon

- **Kurulum:** `GITHUB_ACTIONS_SETUP.md`
- **Alternatifler:** `ALTERNATIVE_CRON_SOLUTIONS.md`
- **Deployment:** `DEPLOYMENT_INSTRUCTIONS.md`

---

## 🆘 Sorun mu Var?

### Workflow çalışmıyor?

- GitHub Actions aktif mi? (Actions sekmesinde enable et)
- CRON_SECRET GitHub ve Vercel'de aynı mı?

### HTTP 401 hatası?

- CRON_SECRET'leri kontrol et
- Vercel'de redeploy yap

### Geç çalışıyor?

- Normal, GitHub Actions'da 5-10 dakika gecikme olabilir
- Kritikse cron-job.org kullan (backup)

---

## 🎯 Sonuç

✅ **GitHub Actions ile RSS feed otomatik taraması aktif!**

- Tamamen ücretsiz
- Her 15 dakikada otomatik
- Vercel limitlerini aşmıyor
- Manuel tetikleme mevcut

**Tek yapman gereken:** CRON_SECRET'i GitHub ve Vercel'e eklemek!
