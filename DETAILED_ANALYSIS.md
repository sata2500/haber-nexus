# HaberNexus Detaylı Sistem Analizi

**Tarih:** 15 Kasım 2025

## 1. Kalite Skorlama Sistemi Analizi

### Mevcut Durum

Kalite skorları **gerçek** ve **AI tabanlı** hesaplamalar kullanılarak yapılıyor:

#### A. Genel Kalite Skoru (`calculateQualityScore`)

**Bileşenler:**
1. **Moderation Score (40%)** - AI ile içerik moderasyonu
   - Gemini AI kullanılarak içerik güvenliği analiz ediliyor
   - Kategoriler: nefret söylemi, şiddet, cinsel içerik, spam, dezenformasyon, taciz
   - `safe: true` ise +0.4, değilse +0.2

2. **Fact Check Score (30%)** - AI ile doğruluk kontrolü
   - Gemini AI ile iddiaların doğruluğu kontrol ediliyor
   - İddialar tespit edilip doğrulanıyor
   - `overallScore * 0.3` olarak hesaplanıyor

3. **Length Score (15%)** - Kelime sayısı kontrolü
   - 500-2500 kelime: +0.15
   - 300+ kelime: +0.1

4. **Structure Score (15%)** - Yapı kontrolü
   - Paragraf sayısı (3+)
   - Başlık varlığı (markdown veya büyük harf)
   - Her ikisi de varsa +0.15

**Sonuç:** 0-1 arası normalize edilmiş skor

#### B. Okunabilirlik Skoru (`calculateReadabilityScore`)

**Metrikler:**
1. **Cümle Başına Ortalama Kelime**
   - İdeal: 15-20 kelime → 90 puan
   - İyi: 10-25 kelime → 75 puan
   - Kısa: <10 kelime → 60 puan
   - Uzun: >25 kelime → 50 puan

2. **Paragraf Başına Ortalama Kelime**
   - İdeal: 50-150 kelime → +10 puan
   - İyi: 30-200 kelime → +5 puan

**Sonuç:** 0-100 arası skor

#### C. SEO Skoru (`calculateSeoScore`)

**Bileşenler:**
1. **Keyword Density (30 puan)**
   - İdeal: %1-3 → 30 puan
   - İyi: %0.5-5 → 20 puan
   - Var: >%0 → 10 puan

2. **İçerik Uzunluğu (20 puan)**
   - İdeal: 800-2500 kelime → 20 puan
   - İyi: 500+ kelime → 15 puan
   - Orta: 300+ kelime → 10 puan

3. **Başlıklar (20 puan)**
   - Markdown başlık veya büyük harf başlık var → 20 puan

4. **Paragraflar (15 puan)**
   - 3+ paragraf → 15 puan
   - 2+ paragraf → 10 puan

5. **Linkler (15 puan)**
   - URL veya markdown link var → 15 puan
   - Yok ama potansiyel var → 5 puan

**Sonuç:** 0-100 arası skor

### Değerlendirme

✅ **Güçlü Yönler:**
- Gerçek AI analizi kullanılıyor (Gemini)
- Çok boyutlu değerlendirme (güvenlik, doğruluk, yapı, SEO)
- Profesyonel metrikler

⚠️ **İyileştirme Alanları:**
- AI çağrıları pahalı ve yavaş olabilir
- Hata durumunda fallback skorları düşük
- Skorlar cache'lenmiyor
- Detaylı açıklamalar kullanıcıya gösterilmiyor

---

## 2. Zamanlama (Scheduled Publishing) Sistemi Analizi

### Mevcut Durum

#### A. Veritabanı Şeması

```prisma
model Article {
  status          ArticleStatus @default(DRAFT)
  publishedAt     DateTime?
  scheduledAt     DateTime?
}

enum ArticleStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  ARCHIVED
}
```

#### B. Cron Job Sistemi

**Endpoint:** `/api/cron/publish-scheduled`

**Fonksiyon:** `publishScheduledArticles()`

**Mantık:**
```typescript
// SORUN: publishedAt kullanılıyor, scheduledAt değil!
const dueArticles = await prisma.article.findMany({
  where: {
    status: "SCHEDULED",
    publishedAt: {  // ❌ YANLIŞ - scheduledAt olmalı!
      lte: now
    }
  }
})
```

**Güncelleme:**
```typescript
await prisma.article.updateMany({
  where: { id: { in: dueArticles.map(a => a.id) } },
  data: { status: "PUBLISHED" }
})
```

### Tespit Edilen Sorunlar

❌ **SORUN 1:** Cron job `publishedAt` alanını kontrol ediyor, `scheduledAt` yerine
❌ **SORUN 2:** Cron job otomatik çalışmıyor (Vercel Cron veya external cron gerekli)
❌ **SORUN 3:** `CRON_SECRET` environment variable tanımlanmamış
❌ **SORUN 4:** Makale oluştururken `scheduledAt` doğru set edilmiyor

### Çözüm Planı

1. **Cron fonksiyonunu düzelt:** `publishedAt` → `scheduledAt`
2. **Vercel cron config ekle:** `vercel.json` dosyası
3. **Environment variable ekle:** `CRON_SECRET`
4. **Article creation/update düzelt:** Doğru alan kullanımı
5. **Test endpoint ekle:** Manuel test için

---

## 3. Zengin Metin Editörü Araştırması

### Gereksinimler

- ✅ Markdown desteği
- ✅ WYSIWYG (What You See Is What You Get)
- ✅ Türkçe karakter desteği
- ✅ Görsel yükleme
- ✅ Code block desteği
- ✅ Tablo desteği
- ✅ Next.js 16 uyumluluğu
- ✅ React 19 uyumluluğu

### Seçenekler

#### A. **Tiptap** (ÖNERİLEN)
- ✅ Modern, headless editor
- ✅ Markdown desteği
- ✅ Özelleştirilebilir
- ✅ React uyumlu
- ✅ TypeScript desteği
- ✅ Aktif geliştirme
- ⚠️ Biraz karmaşık kurulum

#### B. **React-SimpleMDE** (MEVCUT)
- ✅ Zaten projede var
- ✅ Basit markdown editor
- ❌ WYSIWYG yok
- ❌ Sınırlı özellikler

#### C. **Novel**
- ✅ Notion-like editor
- ✅ Modern UI
- ✅ AI desteği
- ⚠️ Yeni, az dokümantasyon

#### D. **Lexical (Meta)**
- ✅ Facebook tarafından geliştiriliyor
- ✅ Çok güçlü
- ⚠️ Karmaşık
- ⚠️ Markdown desteği eklenti gerektirir

### Karar: **Tiptap**

**Neden?**
- Markdown + WYSIWYG birlikte
- Kolay özelleştirme
- Güçlü eklenti ekosistemi
- İyi dokümantasyon
- Aktif topluluk

---

## 4. Ek Tespit Edilen Sorunlar

### A. Makale Düzenleme

**Dosya:** `app/admin/articles/[id]/edit/page.tsx`

```typescript
// Zamanlama mantığı hatalı
if (formData.status === "SCHEDULED" && formData.scheduledFor) {
  publishedAt = new Date(formData.scheduledFor).toISOString()
  // ❌ scheduledAt set edilmiyor!
}
```

**Çözüm:** Hem `publishedAt` hem `scheduledAt` set edilmeli

### B. Draft Publish

**Dosya:** `app/api/drafts/[id]/publish/route.ts`

```typescript
publishedAt: publishNow ? new Date() : null,
scheduledAt: scheduledAt ? new Date(scheduledAt) : null
// ✅ Doğru, ama status SCHEDULED olarak set edilmiyor
```

**Çözüm:** `scheduledAt` varsa status `SCHEDULED` olmalı

### C. Environment Variables

**Eksik:**
- `CRON_SECRET` - Cron job güvenliği için

### D. Vercel Configuration

**Eksik:** `vercel.json` dosyası cron job için

---

## 5. Geliştirme Planı

### Faz 1: Kalite Skorları İyileştirme
- [ ] Hata handling iyileştir
- [ ] Cache mekanizması ekle
- [ ] Detaylı açıklamalar ekle
- [ ] UI'da skorları daha iyi göster

### Faz 2: Zamanlama Sistemi Düzeltme
- [ ] Cron fonksiyonunu düzelt (`publishedAt` → `scheduledAt`)
- [ ] Vercel cron config ekle
- [ ] Environment variables ekle
- [ ] Article creation/update düzelt
- [ ] Test endpoint ekle
- [ ] Manuel test yap

### Faz 3: Zengin Metin Editörü
- [ ] Tiptap kurulumu
- [ ] Markdown ↔ HTML dönüşüm
- [ ] Toolbar oluştur
- [ ] Görsel yükleme entegrasyonu
- [ ] Mevcut editörle entegrasyon
- [ ] Toggle özelliği (Markdown ↔ WYSIWYG)

### Faz 4: Kapsamlı Test
- [ ] Tüm özellikleri test et
- [ ] Edge case'leri kontrol et
- [ ] Performance test
- [ ] Build test

### Faz 5: Deployment
- [ ] GitHub'a push
- [ ] Vercel'e deploy
- [ ] Cron job aktif et
- [ ] Production test

---

## 6. Teknik Detaylar

### Tiptap Kurulumu

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-code-block-lowlight
```

### Vercel Cron Config

```json
{
  "crons": [{
    "path": "/api/cron/publish-scheduled",
    "schedule": "* * * * *"
  }]
}
```

### Environment Variables

```env
CRON_SECRET=your-random-secret-key-here
```

---

## Sonuç

Sistem genel olarak iyi tasarlanmış ancak birkaç kritik sorun var:

1. **Kalite Skorları:** ✅ Gerçek ve iyi çalışıyor, iyileştirme alanları var
2. **Zamanlama:** ❌ Çalışmıyor, düzeltme gerekli
3. **Editör:** ⚠️ Basit, zengin editör eklenecek

Tüm sorunlar çözülebilir ve sistem tam fonksiyonel hale getirilebilir.
