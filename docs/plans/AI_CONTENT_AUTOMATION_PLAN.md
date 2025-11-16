# HaberNexus - AI İçerik Otomasyon Sistemi

**Tarih**: 14 Kasım 2025  
**Geliştirici**: Manus AI  
**Proje Sahibi**: Salih TANRISEVEN

---

## 🎯 Vizyon

Özgün, profesyonel düzeyde haberler ve içerikler üreten tam otomatik bir AI sistemi. Hem yazarlar hem de admin tarafından kontrol edilebilen, esnek ve güçlü bir otomasyon platformu.

---

## 🏗️ Sistem Mimarisi

### 1. İçerik Üretim Pipeline

```
[Konu Belirleme] → [Araştırma] → [İçerik Üretimi] → [Kalite Kontrolü] → [SEO Optimizasyonu] → [Yayınlama]
```

#### 1.1 Konu Belirleme (Topic Discovery)

- **Trend Analizi**: Güncel trendleri tespit etme
- **RSS Takibi**: Kaynaklardan konu önerileri
- **Manuel Giriş**: Yazarlar tarafından konu belirleme
- **AI Önerileri**: Geçmiş performansa dayalı öneriler

#### 1.2 Araştırma (Research)

- **Web Araştırması**: Google Gemini ile web araştırması
- **Kaynak Toplama**: Güvenilir kaynaklardan bilgi toplama
- **Fact-Checking**: Bilgi doğruluğunu kontrol etme
- **Kaynak Listeleme**: Referans oluşturma

#### 1.3 İçerik Üretimi (Content Generation)

- **Özgün Yazı**: Tamamen yeni içerik oluşturma
- **Çoklu Perspektif**: Farklı bakış açılarından yazma
- **Stil Seçimi**: Haber, blog, analiz, röportaj
- **Ton Ayarı**: Formal, casual, profesyonel

#### 1.4 Kalite Kontrolü (Quality Control)

- **Özgünlük Kontrolü**: Plagiarism tespiti
- **Dilbilgisi**: Türkçe dilbilgisi kontrolü
- **Fact-Check**: İddia doğrulama
- **Okunabilirlik**: Readability skoru

#### 1.5 SEO Optimizasyonu

- **Anahtar Kelime**: Otomatik keyword araştırması
- **Meta Tags**: Title, description oluşturma
- **İç Linkler**: İlgili içeriklere linkler
- **Görsel Optimizasyonu**: Alt text, caption

#### 1.6 Yayınlama (Publishing)

- **Otomatik Yayın**: Belirlenen zamanda yayınlama
- **Manuel Onay**: Admin/yazar onayı
- **Sosyal Medya**: Otomatik paylaşım
- **Newsletter**: E-posta bildirimi

---

## 🎨 Özellikler

### A. Yazar Özellikleri

#### 1. İçerik Oluşturucu (Content Creator)

- **Konu Girişi**: Basit form ile konu belirleme
- **AI Asistan**: Adım adım rehberlik
- **Taslak Oluşturma**: Otomatik outline
- **Genişletme**: Taslaktan tam makale

#### 2. Araştırma Asistanı

- **Otomatik Araştırma**: Konu hakkında bilgi toplama
- **Kaynak Önerileri**: Güvenilir kaynaklar
- **Alıntı Yönetimi**: Kaynak referansları
- **Fact-Check**: Bilgi doğrulama

#### 3. Düzenleme Asistanı

- **Dilbilgisi Kontrolü**: Otomatik düzeltme
- **Stil İyileştirme**: Yazım stili önerileri
- **Okunabilirlik**: Readability analizi
- **SEO Önerileri**: Anahtar kelime önerileri

#### 4. Görsel Yönetimi

- **Görsel Arama**: AI ile uygun görsel bulma
- **Görsel Üretimi**: DALL-E ile görsel oluşturma
- **Alt Text**: Otomatik alt text
- **Optimizasyon**: Boyut ve format optimizasyonu

#### 5. Yayınlama Kontrolü

- **Önizleme**: Yayın öncesi görüntüleme
- **Zamanlama**: Yayın zamanı belirleme
- **Kategori/Tag**: Otomatik kategorilendirme
- **Sosyal Medya**: Paylaşım metni oluşturma

### B. Admin Özellikleri

#### 1. Otomasyon Dashboard

- **Genel Bakış**: Tüm otomasyonlar
- **Performans**: İstatistikler ve metrikler
- **Kontrol**: Başlat/durdur/düzenle
- **Loglar**: Detaylı aktivite logları

#### 2. İçerik Stratejisi

- **Trend Analizi**: Popüler konular
- **Konu Planlama**: İçerik takvimi
- **Performans Analizi**: En iyi içerikler
- **Öneri Motoru**: AI önerileri

#### 3. Kalite Yönetimi

- **Moderasyon Kuyruğu**: Onay bekleyen içerikler
- **Kalite Skorları**: Tüm içeriklerin skorları
- **Hata Raporları**: Sorunlu içerikler
- **Manuel Müdahale**: Düzenleme ve onaylama

#### 4. Yazar Yönetimi

- **Yazar Performansı**: İstatistikler
- **Kota Yönetimi**: AI kullanım limitleri
- **İzinler**: Özellik erişim kontrolü
- **Eğitim**: Rehberler ve ipuçları

#### 5. RSS ve Kaynak Yönetimi

- **RSS Feed'ler**: Kaynak yönetimi
- **Tarama Ayarları**: Sıklık ve filtreler
- **Kaynak Kalitesi**: Güvenilirlik skorları
- **Otomatik İşleme**: RSS'den makale üretimi

---

## 🔧 Teknik Detaylar

### 1. Veritabanı Şeması

#### ContentAutomation (Otomasyon Kuralları)

```typescript
model ContentAutomation {
  id              String   @id @default(cuid())
  name            String
  description     String?  @db.Text

  // Ownership
  createdBy       String
  creator         User     @relation(fields: [createdBy], references: [id])

  // Type
  type            AutomationType // RSS_TO_ARTICLE, TOPIC_TO_ARTICLE, SCHEDULED_CONTENT

  // Status
  isActive        Boolean  @default(true)
  status          AutomationStatus @default(IDLE)

  // Configuration
  config          Json     // Otomasyon ayarları

  // Schedule
  schedule        String?  // Cron expression
  nextRunAt       DateTime?
  lastRunAt       DateTime?

  // Stats
  totalRuns       Int      @default(0)
  successfulRuns  Int      @default(0)
  failedRuns      Int      @default(0)

  // Relations
  runs            AutomationRun[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([createdBy])
  @@index([type])
  @@index([isActive])
  @@index([nextRunAt])
}

enum AutomationType {
  RSS_TO_ARTICLE
  TOPIC_TO_ARTICLE
  SCHEDULED_CONTENT
  TREND_BASED
  RESEARCH_BASED
}

enum AutomationStatus {
  IDLE
  RUNNING
  PAUSED
  ERROR
}
```

#### AutomationRun (Otomasyon Çalışmaları)

```typescript
model AutomationRun {
  id              String   @id @default(cuid())

  automationId    String
  automation      ContentAutomation @relation(fields: [automationId], references: [id], onDelete: Cascade)

  status          RunStatus

  // Input/Output
  input           Json?
  output          Json?

  // Results
  articlesCreated Int      @default(0)
  articlesPublished Int    @default(0)

  // Error handling
  error           String?  @db.Text

  // Timing
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  duration        Int?     // milliseconds

  @@index([automationId])
  @@index([status])
  @@index([startedAt])
}

enum RunStatus {
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}
```

#### ContentDraft (İçerik Taslakları)

```typescript
model ContentDraft {
  id              String   @id @default(cuid())

  // Ownership
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])

  // Content
  topic           String
  outline         Json?    // Başlıklar ve alt başlıklar
  research        Json?    // Araştırma notları
  draft           String?  @db.Text

  // AI Metadata
  aiGenerated     Boolean  @default(false)
  aiPrompt        String?  @db.Text
  aiModel         String?

  // Status
  status          DraftStatus @default(DRAFT)

  // Quality
  qualityScore    Float?
  readabilityScore Float?
  seoScore        Float?

  // Relations
  articleId       String?  @unique
  article         Article? @relation(fields: [articleId], references: [id])

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([authorId])
  @@index([status])
  @@index([createdAt])
}

enum DraftStatus {
  DRAFT
  RESEARCHING
  GENERATING
  REVIEW
  APPROVED
  PUBLISHED
}
```

#### ResearchSource (Araştırma Kaynakları)

```typescript
model ResearchSource {
  id              String   @id @default(cuid())

  draftId         String
  draft           ContentDraft @relation(fields: [draftId], references: [id], onDelete: Cascade)

  // Source info
  title           String
  url             String
  excerpt         String?  @db.Text

  // Reliability
  reliability     Float    @default(0.5)
  isVerified      Boolean  @default(false)

  // Usage
  isUsed          Boolean  @default(false)
  citationText    String?  @db.Text

  createdAt       DateTime @default(now())

  @@index([draftId])
}
```

### 2. API Endpoints

#### Content Automation

- `GET /api/automations` - Liste
- `POST /api/automations` - Yeni otomasyon
- `GET /api/automations/[id]` - Detay
- `PATCH /api/automations/[id]` - Güncelleme
- `DELETE /api/automations/[id]` - Silme
- `POST /api/automations/[id]/run` - Manuel çalıştırma
- `POST /api/automations/[id]/pause` - Duraklat
- `POST /api/automations/[id]/resume` - Devam ettir

#### Content Generation

- `POST /api/content/generate` - İçerik üretimi
- `POST /api/content/research` - Araştırma
- `POST /api/content/outline` - Outline oluşturma
- `POST /api/content/expand` - Taslaktan makale
- `POST /api/content/improve` - İyileştirme
- `POST /api/content/seo-optimize` - SEO optimizasyonu

#### Drafts

- `GET /api/drafts` - Taslak listesi
- `POST /api/drafts` - Yeni taslak
- `GET /api/drafts/[id]` - Taslak detayı
- `PATCH /api/drafts/[id]` - Güncelleme
- `DELETE /api/drafts/[id]` - Silme
- `POST /api/drafts/[id]/publish` - Yayınlama

---

## 🎯 İçerik Üretim Stratejileri

### 1. Trend-Based (Trend Bazlı)

```typescript
{
  type: "TREND_BASED",
  config: {
    sources: ["google_trends", "twitter_trends", "news_sites"],
    categories: ["teknoloji", "ekonomi", "spor"],
    minTrendScore: 0.7,
    contentStyle: "news",
    autoPublish: false,
    dailyLimit: 5
  }
}
```

### 2. RSS-Based (RSS Bazlı)

```typescript
{
  type: "RSS_TO_ARTICLE",
  config: {
    rssFeedIds: ["feed1", "feed2"],
    rewriteStyle: "news",
    minQualityScore: 0.7,
    addResearch: true,
    autoPublish: false,
    schedule: "0 */6 * * *" // Her 6 saatte bir
  }
}
```

### 3. Topic-Based (Konu Bazlı)

```typescript
{
  type: "TOPIC_TO_ARTICLE",
  config: {
    topics: [
      "Yapay zeka son gelişmeleri",
      "Kripto para piyasası analizi"
    ],
    researchDepth: "deep", // shallow, medium, deep
    contentLength: "long", // short, medium, long
    includeImages: true,
    includeSources: true,
    autoPublish: false
  }
}
```

### 4. Scheduled Content (Zamanlanmış İçerik)

```typescript
{
  type: "SCHEDULED_CONTENT",
  config: {
    schedule: "0 9 * * 1-5", // Hafta içi her gün 09:00
    contentType: "daily_summary",
    categories: ["teknoloji"],
    autoPublish: true
  }
}
```

---

## 🎨 UI/UX Tasarımı

### 1. Yazar Dashboard

#### Ana Sayfa

```
┌─────────────────────────────────────────────┐
│ 📝 İçerik Oluşturucu                        │
├─────────────────────────────────────────────┤
│                                             │
│  [Yeni Makale]  [Taslaklar]  [Yayınlananlar]│
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 🤖 AI Asistan                       │   │
│  │                                     │   │
│  │ Ne hakkında yazmak istersiniz?     │   │
│  │ [___________________________]      │   │
│  │                                     │   │
│  │ [🔍 Araştır]  [✍️ Taslak Oluştur]  │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Son Taslaklar:                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📄 Yapay Zeka Trendleri            │   │
│  │    Durum: Araştırma                 │   │
│  │    Kalite: ⭐⭐⭐⭐☆                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### İçerik Oluşturma Sihirbazı

```
Adım 1: Konu Belirleme
┌─────────────────────────────────────────────┐
│ Konu: [_____________________________]       │
│                                             │
│ 🤖 AI Önerileri:                            │
│ • Yapay zeka etiği                          │
│ • Blockchain teknolojisi                    │
│ • Metaverse geleceği                        │
└─────────────────────────────────────────────┘

Adım 2: Araştırma
┌─────────────────────────────────────────────┐
│ 🔍 Araştırma Yapılıyor...                   │
│ ████████████░░░░░░░░ 60%                    │
│                                             │
│ Bulunan Kaynaklar: 12                       │
│ Güvenilir Kaynaklar: 8                      │
└─────────────────────────────────────────────┘

Adım 3: Outline Oluşturma
┌─────────────────────────────────────────────┐
│ 📋 Makale Yapısı                            │
│                                             │
│ 1. Giriş                                    │
│    - Yapay zekanın tanımı                   │
│    - Güncel durum                           │
│                                             │
│ 2. Ana Konu                                 │
│    - Etik sorunlar                          │
│    - Çözüm önerileri                        │
│                                             │
│ 3. Sonuç                                    │
│                                             │
│ [Düzenle] [Onayla]                          │
└─────────────────────────────────────────────┘

Adım 4: İçerik Üretimi
┌─────────────────────────────────────────────┐
│ ✍️ Makale Yazılıyor...                      │
│ ████████████████████ 100%                   │
│                                             │
│ Kelime Sayısı: 1,247                        │
│ Okunabilirlik: ⭐⭐⭐⭐⭐                    │
│ SEO Skoru: 85/100                           │
└─────────────────────────────────────────────┘
```

### 2. Admin Dashboard

#### Otomasyon Yönetimi

```
┌─────────────────────────────────────────────┐
│ 🤖 İçerik Otomasyonları                     │
├─────────────────────────────────────────────┤
│                                             │
│ [+ Yeni Otomasyon]                          │
│                                             │
│ Aktif Otomasyonlar:                         │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📰 RSS Haber Otomasyonu             │   │
│ │ Durum: ✅ Aktif                      │   │
│ │ Son Çalışma: 2 saat önce            │   │
│ │ Üretilen: 12 makale                 │   │
│ │ [⏸️ Duraklat] [⚙️ Ayarlar] [📊 İstatistikler]│
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ 📈 Trend Bazlı İçerik               │   │
│ │ Durum: ⏸️ Duraklatıldı              │   │
│ │ Son Çalışma: 1 gün önce             │   │
│ │ Üretilen: 8 makale                  │   │
│ │ [▶️ Başlat] [⚙️ Ayarlar] [📊 İstatistikler]│
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

#### Kalite Kontrol Paneli

```
┌─────────────────────────────────────────────┐
│ ✅ Onay Bekleyen İçerikler                  │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │ Yapay Zeka ve Etik                  │   │
│ │ Yazar: AI Bot                       │   │
│ │ Kalite: ⭐⭐⭐⭐⭐ (0.92)            │   │
│ │ SEO: 88/100                         │   │
│ │ Okunabilirlik: Yüksek               │   │
│ │                                     │   │
│ │ [👁️ Önizle] [✅ Onayla] [✏️ Düzenle] [❌ Reddet]│
│ └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🚀 Uygulama Planı

### Faz 1: Temel Altyapı (1-2 Gün)

- ✅ Veritabanı şeması
- ✅ API endpoint'leri
- ✅ Temel servisler

### Faz 2: İçerik Üretim Motoru (2-3 Gün)

- ✅ Araştırma modülü
- ✅ Outline oluşturma
- ✅ İçerik üretimi
- ✅ Kalite kontrolü

### Faz 3: Otomasyon Sistemi (2-3 Gün)

- ✅ Otomasyon kuralları
- ✅ Zamanlayıcı (scheduler)
- ✅ Job queue sistemi
- ✅ Hata yönetimi

### Faz 4: Yazar Dashboard (2-3 Gün)

- ✅ İçerik oluşturma sihirbazı
- ✅ Taslak yönetimi
- ✅ Önizleme ve düzenleme
- ✅ Yayınlama

### Faz 5: Admin Dashboard (2-3 Gün)

- ✅ Otomasyon yönetimi
- ✅ Kalite kontrol paneli
- ✅ İstatistikler ve raporlar
- ✅ Yazar yönetimi

### Faz 6: Test ve Optimizasyon (1-2 Gün)

- ✅ Entegrasyon testleri
- ✅ Performans optimizasyonu
- ✅ Kullanıcı testleri
- ✅ Dokümantasyon

---

## 💡 Gelişmiş Özellikler (Gelecek)

### 1. Çoklu Dil Desteği

- Otomatik çeviri
- Çok dilli içerik üretimi
- Yerelleştirme

### 2. Ses ve Video

- Text-to-speech
- Video script oluşturma
- Podcast içeriği

### 3. Sosyal Medya Entegrasyonu

- Otomatik paylaşım
- Sosyal medya içeriği
- Engagement analizi

### 4. Kişiselleştirme

- Kullanıcı bazlı içerik
- A/B testing
- Dinamik içerik

---

## 📊 Başarı Metrikleri

### İçerik Kalitesi

- Ortalama kalite skoru > 0.8
- Okunabilirlik skoru > 70
- SEO skoru > 80

### Üretim Verimliliği

- Makale başına süre < 5 dakika
- Günlük makale sayısı > 10
- Hata oranı < 5%

### Kullanıcı Memnuniyeti

- Yazar memnuniyeti > 4.5/5
- Admin memnuniyeti > 4.5/5
- Okuyucu engagement > %30

---

**Sonraki Adım**: Faz 1'i başlatıyoruz! 🚀
