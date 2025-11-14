# Okuma Takip Sistemi Geliştirme Planı

## 📅 Tarih
15 Kasım 2025

## 🎯 Hedef
Kullanıcıların makale okuma davranışlarını otomatik olarak takip eden, okuma süresi, ilerleme yüzdesi ve tamamlanma durumunu kaydeden profesyonel bir sistem geliştirmek.

---

## 📊 Mevcut Durum Analizi

### Veritabanı Şeması
**ReadingHistory Modeli** (Mevcut)
```prisma
model ReadingHistory {
  id           String   @id @default(cuid())
  userId       String
  articleId    String
  readDuration Int      @default(0)  // seconds
  progress     Float    @default(0)  // percentage 0-100
  completed    Boolean  @default(false)
  lastReadAt   DateTime @default(now())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  article Article @relation(fields: [articleId], references: [id], onDelete: Cascade)

  @@unique([userId, articleId])
  @@index([userId])
  @@index([articleId])
}
```

### Mevcut API Endpoint'leri
- `GET /api/users/[id]/reading-history` - Okuma geçmişini getir
- `POST /api/users/[id]/reading-history` - Yeni okuma kaydı ekle/güncelle

### Eksikler
1. ❌ Client-side otomatik takip yok
2. ❌ Scroll tracking yok
3. ❌ Time tracking yok
4. ❌ Progress calculation yok
5. ❌ Otomatik kaydetme yok
6. ❌ Makale sayfasında entegrasyon yok

---

## 🏗️ Sistem Mimarisi

### 1. Client-Side Tracking
**Bileşen:** `ReadingTracker`
- Scroll position tracking
- Time tracking (active reading time)
- Progress calculation
- Visibility detection (tab active/inactive)
- Periodic auto-save (her 30 saniye)
- Page unload'da final save

### 2. Backend API
**Endpoint:** `POST /api/reading-history`
- Kullanıcı authentication
- Reading history create/update
- Progress validation
- Completion detection (>90% = completed)

### 3. Analytics Integration
**Profil Paneli:**
- Toplam okuma süresi
- Tamamlanan makale sayısı
- Ortalama okuma süresi
- Okuma trendleri
- En çok okunan kategoriler
- Okuma alışkanlıkları

---

## 📐 Teknik Detaylar

### Scroll Tracking
```typescript
// Makale içeriğinin scroll pozisyonunu takip et
const contentElement = document.querySelector('.article-content')
const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100
```

### Time Tracking
```typescript
// Aktif okuma süresini takip et
let activeTime = 0
let lastActiveTime = Date.now()

// Visibility API ile tab aktif mi kontrol et
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Tab pasif, süreyi durdur
  } else {
    // Tab aktif, süreyi başlat
  }
})
```

### Progress Calculation
```typescript
// İlerleme = Max(scroll percentage, time-based estimate)
const timeBasedProgress = (readTime / estimatedTotalTime) * 100
const scrollBasedProgress = scrollPercentage
const progress = Math.max(timeBasedProgress, scrollBasedProgress)
```

### Auto-Save Strategy
```typescript
// 1. Periodic save (her 30 saniye)
setInterval(() => saveProgress(), 30000)

// 2. Scroll milestone save (her %10'da)
if (progress % 10 === 0 && progress !== lastSavedProgress) {
  saveProgress()
}

// 3. Page unload save (sayfa kapatılırken)
window.addEventListener('beforeunload', () => saveProgress())
```

---

## 🎨 Kullanıcı Arayüzü

### Makale Sayfasında
**Progress Bar (Opsiyonel)**
- Sayfanın üstünde ince progress bar
- Scroll ile birlikte güncellenir
- Tamamlandığında yeşil renk

**Reading Stats (Opsiyonel)**
- "X dakika okudunuz"
- "Makalenin %Y'sini tamamladınız"
- Floating badge veya footer

### Profil Panelinde
**Okuma Geçmişi Tab'ı**
- Her makale için progress bar
- Okuma süresi gösterimi
- Tamamlanma badge'i
- Son okuma tarihi

**Analizler Tab'ı**
- Günlük/haftalık okuma grafikleri
- Toplam okuma süresi
- Tamamlama oranı
- Kategori dağılımı

---

## 🔧 Geliştirme Adımları

### Faz 1: Client-Side Tracking Component
**Dosya:** `components/article/reading-tracker.tsx`

**Özellikler:**
- useEffect ile scroll listener
- useEffect ile time tracker
- useEffect ile visibility detector
- useRef ile timer management
- Debounced save function
- Error handling

**Props:**
```typescript
{
  articleId: string
  userId: string
  estimatedReadTime: number  // minutes
}
```

### Faz 2: API Endpoint Geliştirme
**Dosya:** `app/api/reading-history/route.ts`

**POST Endpoint:**
```typescript
{
  articleId: string
  readDuration: number      // seconds
  progress: number          // 0-100
  completed: boolean
}
```

**Response:**
```typescript
{
  success: boolean
  readingHistory: {
    id: string
    progress: number
    completed: boolean
    totalReadTime: number
  }
}
```

### Faz 3: Makale Sayfası Entegrasyonu
**Dosya:** `app/articles/[slug]/page.tsx`

**Değişiklikler:**
- ReadingTracker bileşenini ekle
- Session kontrolü
- Estimated read time hesapla
- Props'ları geç

### Faz 4: Profil Paneli Güncellemeleri
**Dosyalar:**
- `app/profile/components/reading-history-tab.tsx` (güncelle)
- `app/profile/components/analytics-tab.tsx` (güncelle)
- `app/api/users/[id]/analytics/route.ts` (güncelle)

**Yeni Metrikler:**
- Gerçek okuma verileri kullan
- Doğru tamamlanma oranı
- Doğru ortalama okuma süresi
- Günlük/haftalık trendler

### Faz 5: Ek Özellikler
**Reading Progress Bar**
- Sayfanın üstünde ince bar
- Scroll ile güncellenir
- Smooth animation

**Reading Stats Badge**
- Floating badge (bottom-right)
- Okuma süresi ve ilerleme
- Minimize/expand

---

## 📊 Veri Yapısı

### ReadingHistory Record
```typescript
{
  id: "cuid",
  userId: "user_id",
  articleId: "article_id",
  readDuration: 180,        // 3 dakika (saniye)
  progress: 45.5,           // %45.5 tamamlandı
  completed: false,
  lastReadAt: "2025-11-15T10:30:00Z",
  createdAt: "2025-11-15T10:27:00Z",
  updatedAt: "2025-11-15T10:30:00Z"
}
```

### Analytics Data
```typescript
{
  totalReads: 150,
  completedReads: 85,
  totalReadingTimeMinutes: 1250,
  avgReadingTimeMinutes: 8.3,
  completionRate: 56.7,
  readsLastWeek: 12,
  topCategories: [
    { name: "Teknoloji", count: 45 },
    { name: "Bilim", count: 32 }
  ],
  readingTrend: [
    { date: "2025-11-08", count: 2 },
    { date: "2025-11-09", count: 3 }
  ]
}
```

---

## 🔐 Güvenlik ve Performans

### Güvenlik
- ✅ Authentication required
- ✅ User can only track own reading
- ✅ Rate limiting (max 1 save per 10 seconds)
- ✅ Data validation (progress 0-100)

### Performans
- ✅ Debounced save (prevent spam)
- ✅ Batch updates (combine multiple changes)
- ✅ Indexed database queries
- ✅ Efficient scroll calculations

### Privacy
- ✅ User consent (optional)
- ✅ Data retention policy
- ✅ Export reading history
- ✅ Delete reading history

---

## 🧪 Test Senaryoları

### Scroll Tracking
1. Kullanıcı makaleyi açar
2. Scroll yapar (%50'ye kadar)
3. Progress %50 olarak kaydedilir

### Time Tracking
1. Kullanıcı makaleyi açar
2. 3 dakika okur
3. readDuration 180 saniye olarak kaydedilir

### Completion Detection
1. Kullanıcı makaleyi sonuna kadar okur
2. Progress %95'e ulaşır
3. completed = true olarak işaretlenir

### Tab Visibility
1. Kullanıcı makaleyi okur
2. Başka tab'a geçer
3. Okuma süresi duraklatılır
4. Geri döner
5. Okuma süresi devam eder

### Auto-Save
1. Kullanıcı 30 saniye okur
2. Otomatik kayıt yapılır
3. Kullanıcı sayfayı kapatır
4. Final kayıt yapılır

---

## 📈 Başarı Metrikleri

### Teknik
- ✅ %99+ tracking accuracy
- ✅ <100ms save latency
- ✅ Zero data loss on page unload
- ✅ Efficient database queries

### Kullanıcı Deneyimi
- ✅ Invisible tracking (no UI disruption)
- ✅ Accurate progress display
- ✅ Meaningful analytics
- ✅ Fast profile page load

---

## 🚀 Deployment Checklist

- [ ] ReadingTracker component implemented
- [ ] API endpoint created and tested
- [ ] Article page integration complete
- [ ] Profile panel updated
- [ ] Analytics calculations correct
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] TypeScript types defined
- [ ] Build successful
- [ ] GitHub pushed

---

## 🔮 Gelecek İyileştirmeler

### Öncelik: Yüksek
- [ ] Reading streak (günlük okuma serisi)
- [ ] Reading goals (hedef belirleme)
- [ ] Reading reminders (hatırlatmalar)

### Öncelik: Orta
- [ ] Reading speed calculation
- [ ] Estimated time remaining
- [ ] Reading heatmap (hangi saatlerde okur)
- [ ] Reading badges/achievements

### Öncelik: Düşük
- [ ] Social reading (arkadaşlarla karşılaştırma)
- [ ] Reading challenges
- [ ] Reading recommendations based on history
- [ ] Export reading data (CSV, JSON)

---

**Sonuç**: Bu plan ile kullanıcıların okuma davranışları otomatik olarak takip edilecek ve profil panellerinde anlamlı analizler sunulacak.
