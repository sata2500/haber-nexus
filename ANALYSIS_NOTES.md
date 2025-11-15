# HaberNexus AI İçerik Oluşturucu Analiz Notları

## Tarih: 2025-11-15

## Mevcut Durum Analizi

### 1. AI İçerik Oluşturucu Akışı

**Frontend (content-creator/page.tsx):**
- İki adımlı süreç: Konu belirleme → İçerik önizleme
- Form verileri: topic, style, tone, length, keywords, includeResearch
- API çağrısı: POST /api/content/generate
- Response'dan draftId ve generatedContent alınıyor
- Step 2'de içerik önizlemesi gösteriliyor

**Backend (api/content/generate/route.ts):**
- Action: "generate_article"
- generateArticle() fonksiyonu çağrılıyor
- ContentDraft oluşturuluyor ve veritabanına kaydediliyor
- Draft içeriği: outline, research, draft (içerik), qualityScore, readabilityScore, seoScore
- Response: draftId ve generated content bilgileri

**AI Generator (lib/ai/content-generator.ts):**
- generateArticle() fonksiyonu:
  1. Research yapıyor (conductResearch)
  2. Outline oluşturuyor (createOutline)
  3. İçerik üretiyor (generateContentFromOutline)
  4. Title, excerpt, SEO metadata üretiyor
  5. Kalite skorları hesaplıyor
- Gemini 2.5 Flash modeli kullanılıyor

### 2. Taslak Düzenleme Akışı

**Taslaklar Listesi (admin/drafts/page.tsx):**
- API: GET /api/drafts
- Taslakları listeler
- "Düzenle" butonu → /admin/drafts/{id}

**Taslak Düzenleme (admin/drafts/[id]/page.tsx):**
- API: GET /api/drafts/{id}
- Form alanları: topic, draft (içerik), status
- Kaydet: PATCH /api/drafts/{id}
- Yayınla: POST /api/drafts/{id}/publish

**API Endpoint (api/drafts/[id]/route.ts):**
- GET: Draft bilgilerini getir (author, article, sources dahil)
- PATCH: Draft güncelle
- DELETE: Draft sil

## Tespit Edilen Sorun

### Problem: Oluşturulan içerik taslak düzenleme sayfasında görünmüyor

**Neden:**
1. `generateArticle()` fonksiyonu `content` alanını döndürüyor
2. Ancak veritabanına kaydederken `draft` alanına yazılıyor
3. Frontend'de ise `formData.draft` state'i kullanılıyor
4. API'den gelen `data.draft` değeri form alanına yükleniyor

**Sorunun Kaynağı:**
- `api/content/generate/route.ts` dosyasında (satır 57):
  ```typescript
  draft: generated.content,  // ✓ İçerik kaydediliyor
  ```
- Ancak `admin/drafts/[id]/page.tsx` dosyasında (satır 76):
  ```typescript
  draft: data.draft || "",  // ✓ Draft alanı okunuyor
  ```

**Gerçek Sorun:**
- Kod yapısı doğru görünüyor
- Ancak kullanıcı tarafından belirtilen sorun: "düzenle diyorum ama oluşturulan içeriği göremiyorum"
- Bu durumda iki olasılık var:
  1. Draft içeriği veritabanına kaydedilmiyor
  2. Draft içeriği frontend'de doğru görüntülenmiyor

## İnceleme Gereken Noktalar

### 1. Veritabanı Şeması
- ContentDraft modelinin `draft` alanı Text tipinde mi?
- Uzun içerikleri destekliyor mu?

### 2. API Response
- `/api/content/generate` endpoint'i doğru response dönüyor mu?
- `generated.content` değeri dolu mu?

### 3. Frontend State Management
- `formData.draft` state'i doğru güncelleniyor mu?
- Textarea'da içerik görüntüleniyor mu?

### 4. Gemini API
- `generateContentFromOutline()` fonksiyonu içerik üretiyor mu?
- API key çalışıyor mu?

## Çözüm Planı

### Adım 1: Prisma Şemasını İncele
- ContentDraft modelini kontrol et
- Draft alanının tipini ve özelliklerini doğrula

### Adım 2: Gemini API Entegrasyonunu Test Et
- `lib/ai/gemini.ts` dosyasını incele
- API key'in doğru ayarlandığından emin ol
- Test endpoint'i oluştur

### Adım 3: Debug Logging Ekle
- Content generation sırasında log ekle
- Draft kaydetme sırasında log ekle
- Frontend'de draft yükleme sırasında log ekle

### Adım 4: Frontend İyileştirmeleri
- Loading state'leri ekle
- Error handling iyileştir
- Draft içeriğinin görüntülenmesini garanti et

### Adım 5: Tam Fonksiyonel Hale Getir
- Tüm akışı test et
- Hataları düzelt
- Kullanıcı deneyimini iyileştir
