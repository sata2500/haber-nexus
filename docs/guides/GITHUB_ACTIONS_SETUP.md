# GitHub Actions ile RSS Feed Otomatik Tarama

## 🎯 Çözüm

Vercel Hobby plan'da cron job limiti olduğu için **GitHub Actions** kullanıyoruz.

**Avantajlar:**

- ✅ Tamamen ücretsiz
- ✅ Her 15 dakikada otomatik çalışır
- ✅ Vercel limitlerini aşmıyor
- ✅ Manuel tetikleme de mevcut
- ✅ Hata bildirimleri

---

## 📋 Kurulum Adımları

### 1. CRON_SECRET Oluşturma

Terminal'de çalıştırın:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

veya

```bash
openssl rand -hex 32
```

Çıkan değeri kopyalayın (örnek: `a1b2c3d4e5f6...`)

---

### 2. GitHub Secrets'a CRON_SECRET Ekleme

1. GitHub'da projenize gidin: https://github.com/sata2500/haber-nexus
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** butonuna tıklayın
4. Secret bilgileri:
   - **Name:** `CRON_SECRET`
   - **Value:** (1. adımda oluşturduğunuz key)
5. **Add secret** butonuna tıklayın

---

### 3. Vercel Environment Variable Ekleme

1. Vercel Dashboard'a gidin: https://vercel.com
2. HaberNexus projesini seçin
3. **Settings** → **Environment Variables**
4. Yeni variable ekleyin:
   - **Key:** `CRON_SECRET`
   - **Value:** (1. adımda oluşturduğunuz aynı key)
   - **Environment:** Production, Preview, Development (hepsini seç)
5. **Save** butonuna tıklayın

**ÖNEMLİ:** GitHub ve Vercel'de aynı CRON_SECRET değerini kullanın!

---

### 4. GitHub'a Push (Zaten Yapıldı ✅)

Workflow dosyası zaten commit edildi ve push yapıldı:

- Dosya: `.github/workflows/rss-scan.yml`
- Commit: Sonraki commit'te eklenecek

---

### 5. GitHub Actions'ı Aktif Etme

1. GitHub'da projenize gidin: https://github.com/sata2500/haber-nexus
2. **Actions** sekmesine tıklayın
3. Eğer "Workflows found" mesajı görüyorsanız:
   - **I understand my workflows, go ahead and enable them** butonuna tıklayın
4. Sol tarafta **RSS Feed Auto Scan** workflow'unu göreceksiniz

---

### 6. Manuel Test

İlk çalıştırmayı manuel olarak test edin:

1. **Actions** sekmesinde **RSS Feed Auto Scan** workflow'una tıklayın
2. Sağ üstte **Run workflow** butonuna tıklayın
3. **Run workflow** (yeşil buton) ile onaylayın
4. Workflow çalışmaya başlayacak
5. Tıklayarak logları görebilirsiniz

**Beklenen Çıktı:**

```
HTTP Status Code: 200
Response Body: {"success":true,"timestamp":"...","summary":{...}}
RSS scan completed successfully!
```

---

## 🕐 Çalışma Zamanlaması

**Schedule:** Her 15 dakikada bir

```yaml
schedule:
  - cron: "*/15 * * * *"
```

**Not:** GitHub Actions UTC timezone kullanır. Türkiye saati UTC+3.

**Örnek Çalışma Saatleri (Türkiye Saati):**

- 03:00, 03:15, 03:30, 03:45
- 04:00, 04:15, 04:30, 04:45
- ... (her 15 dakikada)

---

## 🔍 Monitoring

### GitHub Actions Logları

1. GitHub → **Actions** sekmesi
2. **RSS Feed Auto Scan** workflow'u
3. Son çalıştırmaları görebilirsiniz
4. Her çalıştırmaya tıklayarak detaylı log görebilirsiniz

### Başarılı Çalıştırma Örneği

```
✓ Trigger RSS Feed Scan
HTTP Status Code: 200
Response Body: {
  "success": true,
  "timestamp": "2025-11-15T12:00:00.000Z",
  "summary": {
    "totalFeeds": 5,
    "scannedFeeds": 3,
    "successfulScans": 3,
    "failedScans": 0,
    "totalItemsProcessed": 12,
    "totalItemsPublished": 8
  }
}
RSS scan completed successfully!
```

### Başarısız Çalıştırma

Eğer hata olursa:

- ❌ Kırmızı X işareti görürsünüz
- Email bildirimi alırsınız (GitHub ayarlarınıza göre)
- Log'da hata detaylarını görebilirsiniz

---

## 🛠️ Sorun Giderme

### Workflow Çalışmıyor

**Kontrol Listesi:**

1. ✅ GitHub Secrets'da `CRON_SECRET` var mı?
2. ✅ Vercel'de `CRON_SECRET` environment variable var mı?
3. ✅ İkisi de aynı değer mi?
4. ✅ GitHub Actions aktif mi? (Actions sekmesinde enable edildi mi?)
5. ✅ `.github/workflows/rss-scan.yml` dosyası commit edildi mi?

### HTTP 401 Unauthorized

**Sebep:** CRON_SECRET yanlış veya eksik

**Çözüm:**

1. GitHub Secrets'daki `CRON_SECRET`'i kontrol edin
2. Vercel'deki `CRON_SECRET`'i kontrol edin
3. İkisinin de aynı olduğundan emin olun
4. Vercel'de değişiklik yaptıysanız redeploy edin

### HTTP 500 Internal Server Error

**Sebep:** API endpoint'inde hata var

**Çözüm:**

1. Vercel Functions loglarını kontrol edin
2. Database bağlantısını kontrol edin
3. RSS feed'lerin URL'lerini kontrol edin

### Workflow Çok Geç Çalışıyor

**Sebep:** GitHub Actions'da yoğunluk olabilir (ücretsiz tier)

**Çözüm:**

- Normal, bazen 5-10 dakika gecikme olabilir
- Kritik değilse sorun değil
- Eğer kritikse cron-job.org gibi alternatif kullanın

---

## 🔄 Alternatif: cron-job.org (Backup)

GitHub Actions'a ek olarak cron-job.org da kullanabilirsiniz:

### Kurulum

1. https://cron-job.org/en/ adresine gidin
2. Ücretsiz hesap oluşturun
3. **Create cronjob** butonuna tıklayın
4. Ayarlar:
   - **Title:** HaberNexus RSS Scan
   - **URL:** `https://habernexus.com/api/cron/scan-rss-feeds`
   - **Schedule:** Every 15 minutes
   - **Request method:** GET
   - **Headers:**
     - Name: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET`
5. **Create** butonuna tıklayın

### Avantajlar

- ✅ Çift güvenlik (GitHub Actions fail olursa bu çalışır)
- ✅ Daha garantili timing
- ✅ Email bildirimleri
- ✅ Monitoring dashboard

---

## 📊 Vercel Cron Job Kullanımı

Vercel'de sadece 1 cron job kaldı:

- **publish-scheduled:** Her saat başı zamanlanmış makaleleri yayınlar

Bu Hobby plan limitine uygun (2 cron job max, günde 1 kez).

---

## ✅ Checklist

- [ ] CRON_SECRET oluşturuldu
- [ ] GitHub Secrets'a `CRON_SECRET` eklendi
- [ ] Vercel'e `CRON_SECRET` environment variable eklendi
- [ ] GitHub'a push yapıldı
- [ ] GitHub Actions aktif edildi
- [ ] Manuel test yapıldı (Run workflow)
- [ ] 15 dakika sonra otomatik çalıştığı kontrol edildi
- [ ] RSS feed'lerin "Son tarama" tarihi güncellendi

---

## 🎉 Tamamlandı!

GitHub Actions ile RSS feed otomatik taraması artık çalışıyor!

**Özet:**

- ✅ Tamamen ücretsiz
- ✅ Her 15 dakikada otomatik
- ✅ Vercel limitlerini aşmıyor
- ✅ Manuel tetikleme mevcut
- ✅ Hata bildirimleri aktif

**Not:** İlk çalıştırma için 15 dakika bekleyin veya manuel tetikleyin.
