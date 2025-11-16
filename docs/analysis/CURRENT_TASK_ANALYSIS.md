# HaberNexus - Mevcut Görev Analizi

**Tarih:** 15 Kasım 2025  
**Görev:** RSS Feed Yönetimi ve Admin Dashboard Düzeltmeleri

## Tespit Edilen Sorunlar

### 1. RSS Feed Silme Sorunu ❌

**Konum:**

- `/app/admin/rss-feeds/page.tsx` (satır 64-110)
- `/app/api/rss-feeds/[id]/route.ts` (satır 160-237)

**Mevcut Davranış:**

- RSS feed silindiğinde makaleler de silinebiliyor (cascade=true)
- Kullanıcıya "OK: RSS feed ve tüm makaleleri sil" seçeneği sunuluyor

**İstenen Davranış:**

- RSS feed silindiğinde sadece feed ve scan logları silinsin
- Makaleler silinmesin, sourceRssId alanı null olsun
- Kullanıcı makaleleri manuel olarak silmek isterse ayrıca silsin

**Çözüm:**

1. DELETE endpoint'ini güncelle
2. Cascade parametresini kaldır
3. Makalelerin sourceRssId'sini null yap
4. Frontend onay dialogunu basitleştir

---

### 2. RSS Tarama Sorunu ❌

**Konum:**

- `/app/api/rss-feeds/[id]/scan-async/route.ts`
- `/lib/rss/scanner.ts`

**Mevcut Davranış:**

- Manuel tarama: "Tarama arka planda başlatıldı" mesajı gösteriyor ama hiçbir şey olmuyor
- Otomatik tarama: Çalışmıyor (GitHub Actions veya cron job yok)

**Olası Nedenler:**

1. scanRssFeed fonksiyonu sessizce hata veriyor
2. AI işleme timeout oluyor
3. Gemini API hatası
4. Database bağlantı sorunu
5. Hata yakalanıyor ama loglanmıyor

**Çözüm:**

1. scan-async endpoint'ine detaylı hata loglama ekle
2. Scanner fonksiyonuna try-catch ve detaylı log ekle
3. Hata durumunda kullanıcıya anlamlı mesaj göster
4. GitHub Actions workflow oluştur (otomatik tarama için)

---

### 3. Zamanlanmış Makale Filtresi ❌

**Konum:** `/app/admin/articles/page.tsx` (satır 164-168)

**Sorun:**

```tsx
<Button size="sm">Zamanlanmış</Button>
```

- onClick handler yok
- variant prop yok
- Özellik sorunlu olduğu için kaldırılması isteniyor

**Çözüm:**

- Satır 164-168'i tamamen kaldır

---

### 4. GitHub Actions / Cron Job Eksikliği ⚠️

**Konum:** `.github/workflows/` (YOK)

**Sorun:**

- Otomatik RSS tarama için cron job yok
- vercel.json dosyası yok
- GitHub Actions workflow yok

**Çözüm:**

- GitHub Actions workflow oluştur
- Her 15 dakikada /api/rss-feeds/scan-all endpoint'ini tetikle

---

## Prisma Schema İnceleme

### RssFeed Model (satır 419-458)

```prisma
model RssFeed {
  id              String       @id @default(cuid())
  articles        Article[]    // Relation var
  scanLogs        RssScanLog[]
  // onDelete cascade YOK - bu iyi
}
```

### Article Model (satır 137-216)

```prisma
model Article {
  sourceRssId     String?      // Nullable - iyi
  sourceRss       RssFeed?     @relation(fields: [sourceRssId], references: [id])
  // onDelete belirtilmemiş (default: Restrict)
}
```

### RssScanLog Model (satır 460-479)

```prisma
model RssScanLog {
  rssFeedId       String
  rssFeed         RssFeed    @relation(fields: [rssFeedId], references: [id], onDelete: Cascade)
  // Cascade var - feed silinince loglar da silinsin (doğru)
}
```

---

## Gerekli Değişiklikler

### ✅ Faz 1: Analiz

- [x] Proje yapısını incele
- [x] RSS feed silme mantığını anla
- [x] RSS tarama sistemini anla
- [x] Admin dashboard'u incele
- [x] Prisma schema'yı incele

### 🔧 Faz 2: RSS Feed Silme Düzeltmesi

- [ ] `/app/api/rss-feeds/[id]/route.ts` DELETE endpoint'ini güncelle
- [ ] Cascade parametresini kaldır
- [ ] Makalelerin sourceRssId'sini null yap
- [ ] `/app/admin/rss-feeds/page.tsx` onay dialogunu düzenle

### 🔧 Faz 3: RSS Tarama Düzeltmesi

- [ ] `/app/api/rss-feeds/[id]/scan-async/route.ts` detaylı loglama ekle
- [ ] `/lib/rss/scanner.ts` hata yönetimini iyileştir
- [ ] Kullanıcıya anlamlı hata mesajları göster
- [ ] `/app/api/rss-feeds/scan-all/route.ts` kontrol et
- [ ] GitHub Actions workflow oluştur

### 🔧 Faz 4: Zamanlanmış Filtre Kaldırma

- [ ] `/app/admin/articles/page.tsx` satır 164-168 kaldır

### 🔧 Faz 5: Kapsamlı Denetim

- [ ] Tüm admin sayfalarını kontrol et
- [ ] TypeScript hatalarını düzelt
- [ ] Console error'ları temizle
- [ ] UI/UX iyileştirmeleri

### 🔧 Faz 6: Build ve Test

- [ ] npm install
- [ ] npm run build
- [ ] Build hatalarını düzelt
- [ ] TypeScript strict check

### 🔧 Faz 7: GitHub Push

- [ ] Git config
- [ ] Commit message hazırla
- [ ] Push to main

---

## Önemli Dosyalar

### RSS Feed Yönetimi

- `/app/admin/rss-feeds/page.tsx` - Frontend liste
- `/app/admin/rss-feeds/[id]/page.tsx` - Frontend düzenleme
- `/app/api/rss-feeds/[id]/route.ts` - CRUD API
- `/app/api/rss-feeds/[id]/scan-async/route.ts` - Manuel tarama
- `/app/api/rss-feeds/scan-all/route.ts` - Toplu tarama
- `/lib/rss/scanner.ts` - Tarama mantığı
- `/lib/rss/parser.ts` - RSS parse
- `/lib/ai/processor.ts` - AI işleme

### Makale Yönetimi

- `/app/admin/articles/page.tsx` - Makale listesi
- `/app/admin/articles/[id]/edit/page.tsx` - Makale düzenleme

### Database

- `/prisma/schema.prisma` - Database şeması
- `/lib/prisma.ts` - Prisma client

---

## Notlar

1. **RSS Feed Silme:** Kullanıcı haklı, makaleler silinmemeli. RSS kaynağı sadece bir referans.
2. **RSS Tarama:** Hata loglama çok zayıf, kullanıcı ne olduğunu anlamıyor.
3. **Zamanlanmış Filtre:** Incomplete button, kaldırılmalı.
4. **Otomatik Tarama:** GitHub Actions gerekli, vercel.json yerine.
