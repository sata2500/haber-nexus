# Profesyonel Profil Sayfası Geliştirme Planı

## 📋 Proje Analizi

### Mevcut Durum
HaberNexus projesi, Next.js 16, TypeScript, Prisma ORM ve PostgreSQL kullanılarak geliştirilmiş modern bir haber platformudur. Şu anda temel bir profil sayfası mevcut ancak sadece hesap bilgileri ve şifre değiştirme özelliklerini içeriyor.

### Veritabanı Yapısı
Prisma şeması incelendiğinde aşağıdaki modeller mevcuttur:
- **User**: Kullanıcı bilgileri, rol sistemi
- **Article**: Makaleler ve içerikler
- **Like**: Beğeni sistemi (userId + articleId)
- **Bookmark**: Kaydetme sistemi (userId + articleId)
- **Comment**: Yorum sistemi
- **Follow**: Takip sistemi
- **Notification**: Bildirim sistemi
- **AuthorProfile**: Yazar profil bilgileri ve istatistikleri

### Mevcut API Endpoint'leri
- `/api/users/[id]` - Kullanıcı bilgileri
- `/api/likes` - Beğeni işlemleri
- `/api/bookmarks` - Kaydetme işlemleri
- `/api/articles` - Makale işlemleri
- `/api/follows` - Takip işlemleri
- `/api/notifications` - Bildirimler

## 🎯 Profil Sayfası Hedefleri

### Kullanıcı Rolleri
Profil sayfası **USER** (okuyucu) rolündeki kullanıcılar için tasarlanacaktır.

### Ana Özellikler

#### 1. **Profil Genel Bakış**
- Kullanıcı bilgileri (avatar, isim, kullanıcı adı, biyografi)
- Hesap oluşturma tarihi
- Genel istatistikler (toplam beğeni, kayıt, yorum sayısı)

#### 2. **Beğenilen İçerikler**
- Kullanıcının beğendiği makalelerin listesi
- Tarih, kategori, yazar bilgisi ile birlikte
- Sıralama seçenekleri (en yeni, en popüler)
- Sayfalama (pagination)
- Beğeniyi kaldırma özelliği

#### 3. **Kaydedilen İçerikler**
- Kullanıcının kaydettiği makalelerin listesi
- Koleksiyon gibi organize edilmiş görünüm
- Arama ve filtreleme
- Kaydı kaldırma özelliği

#### 4. **Okuma Geçmişi**
- Son okunan makaleler (yeni özellik - veritabanına eklenecek)
- Okuma süresi ve tarihi
- Okuma ilerlemesi (opsiyonel)

#### 5. **Yorum Geçmişi**
- Kullanıcının yaptığı yorumlar
- Hangi makaleye yapıldığı bilgisi
- Yorum tarihi ve beğeni sayısı
- Yorumu düzenleme/silme

#### 6. **Okuma İstatistikleri ve Analizler**
- **Okuma Alışkanlıkları**
  - Haftalık/aylık okuma grafiği
  - En çok okunan kategoriler
  - Okuma saatleri dağılımı
  - Toplam okuma süresi

- **İlgi Alanları Analizi**
  - En çok beğenilen kategoriler
  - En çok takip edilen yazarlar
  - Trend analizi (hangi konulara ilgi duyuyor)
  - Kelime bulutu (en çok okunan konular)

- **Etkileşim Metrikleri**
  - Yorum aktivitesi grafiği
  - Beğeni/kaydetme oranları
  - Sosyal etkileşim skoru

#### 7. **Hesap Ayarları**
- **Profil Bilgileri**
  - İsim, kullanıcı adı, biyografi düzenleme
  - Avatar yükleme/değiştirme
  - E-posta adresi (değiştirilebilir)

- **Güvenlik**
  - Şifre değiştirme
  - İki faktörlü kimlik doğrulama (2FA) - gelecek özellik
  - Aktif oturumlar

- **Gizlilik Ayarları**
  - Profil görünürlüğü (herkese açık/gizli)
  - Okuma geçmişini gizleme
  - E-posta bildirimleri

- **Bildirim Tercihleri**
  - E-posta bildirimleri
  - Yeni makale bildirimleri
  - Yorum yanıtları
  - Takip edilen yazarların yeni içerikleri

- **Tema ve Görünüm**
  - Açık/koyu tema
  - Font boyutu tercihi
  - Okuma modu ayarları

#### 8. **Takip Edilen Yazarlar**
- Takip edilen yazarların listesi
- Yazarların son makaleleri
- Takibi bırakma özelliği

## 🏗️ Teknik Mimari

### Frontend Bileşen Yapısı
```
app/profile/
├── page.tsx (Ana sayfa - Server Component)
├── layout.tsx (Profil layout'u)
└── components/
    ├── profile-header.tsx (Profil başlığı ve avatar)
    ├── profile-tabs.tsx (Tab navigasyonu)
    ├── profile-stats.tsx (Genel istatistikler)
    ├── liked-articles.tsx (Beğenilen içerikler)
    ├── bookmarked-articles.tsx (Kaydedilen içerikler)
    ├── reading-history.tsx (Okuma geçmişi)
    ├── comment-history.tsx (Yorum geçmişi)
    ├── reading-analytics.tsx (Okuma analizleri)
    ├── followed-authors.tsx (Takip edilen yazarlar)
    └── account-settings.tsx (Hesap ayarları)
```

### Backend API Endpoint'leri

#### Yeni Eklenecek Endpoint'ler
1. **GET /api/users/[id]/stats** - Kullanıcı istatistikleri
2. **GET /api/users/[id]/liked-articles** - Beğenilen makaleler
3. **GET /api/users/[id]/bookmarked-articles** - Kaydedilen makaleler
4. **GET /api/users/[id]/reading-history** - Okuma geçmişi
5. **POST /api/users/[id]/reading-history** - Okuma kaydı ekleme
6. **GET /api/users/[id]/comments** - Kullanıcı yorumları
7. **GET /api/users/[id]/analytics** - Detaylı analizler
8. **GET /api/users/[id]/followed-authors** - Takip edilen yazarlar
9. **PATCH /api/users/[id]/settings** - Ayarları güncelleme

### Veritabanı Değişiklikleri

#### Yeni Model: ReadingHistory
```prisma
model ReadingHistory {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  articleId   String
  article     Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  
  // Reading metadata
  startedAt   DateTime @default(now())
  lastReadAt  DateTime @updatedAt
  readDuration Int     @default(0) // seconds
  progress    Float    @default(0) // 0-100
  completed   Boolean  @default(false)
  
  @@unique([userId, articleId])
  @@index([userId])
  @@index([articleId])
  @@index([lastReadAt])
}
```

#### Yeni Model: UserSettings
```prisma
model UserSettings {
  id                    String   @id @default(cuid())
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Privacy
  profileVisibility     String   @default("public") // public, private
  showReadingHistory    Boolean  @default(true)
  
  // Notifications
  emailNotifications    Boolean  @default(true)
  newArticleNotif       Boolean  @default(true)
  commentReplyNotif     Boolean  @default(true)
  followedAuthorNotif   Boolean  @default(true)
  
  // Appearance
  theme                 String   @default("system") // light, dark, system
  fontSize              String   @default("medium") // small, medium, large
  readingMode           String   @default("default") // default, focus
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@index([userId])
}
```

#### User Model'e Eklenecek İlişkiler
```prisma
// User model'e eklenecek
readingHistory  ReadingHistory[]
settings        UserSettings?
```

#### Article Model'e Eklenecek İlişkiler
```prisma
// Article model'e eklenecek
readingHistory  ReadingHistory[]
```

## 🎨 UI/UX Tasarım Prensipleri

### Tasarım Dili
- **Modern ve Minimal**: Temiz, okunabilir, profesyonel görünüm
- **Responsive**: Mobil, tablet ve masaüstü uyumlu
- **Dark Mode**: Açık/koyu tema desteği
- **Erişilebilirlik**: WCAG 2.1 standartlarına uygun

### Renk Paleti
- Mevcut Tailwind CSS tema renkleri kullanılacak
- Vurgu renkleri: Primary, Secondary, Accent
- Durum renkleri: Success, Warning, Error, Info

### Bileşenler
- **Shadcn/ui** kütüphanesi kullanılacak
- Tabs, Cards, Badges, Charts, Tables
- Loading states ve skeleton screens
- Empty states (içerik yoksa gösterilecek)

### Grafikler ve Görselleştirme
- **Recharts** veya **Chart.js** kullanılabilir
- Çizgi grafikleri (okuma trendi)
- Pasta grafikleri (kategori dağılımı)
- Bar grafikleri (haftalık aktivite)

## 🚀 Geliştirme Adımları

### Faz 1: Veritabanı Şeması Güncellemeleri
1. ReadingHistory modelini ekle
2. UserSettings modelini ekle
3. İlişkileri güncelle
4. Migration oluştur ve çalıştır

### Faz 2: Backend API Geliştirmeleri
1. Kullanıcı istatistikleri endpoint'i
2. Beğenilen makaleler endpoint'i
3. Kaydedilen makaleler endpoint'i
4. Okuma geçmişi endpoint'leri
5. Yorum geçmişi endpoint'i
6. Analiz endpoint'i
7. Ayarlar endpoint'i

### Faz 3: Frontend Bileşenleri
1. Profil header ve navigasyon
2. Tab sistemi implementasyonu
3. İstatistik kartları
4. Beğenilen içerikler listesi
5. Kaydedilen içerikler listesi
6. Okuma geçmişi listesi
7. Yorum geçmişi
8. Analiz ve grafikler
9. Hesap ayarları formu

### Faz 4: Entegrasyon ve Optimizasyon
1. Tüm bileşenleri entegre et
2. Loading states ekle
3. Error handling
4. Pagination implementasyonu
5. Filtreleme ve sıralama
6. Responsive tasarım kontrolü

### Faz 5: Test ve Hata Kontrolü
1. TypeScript tip kontrolü
2. ESLint kontrolü
3. Build testi
4. Manuel test senaryoları
5. Performance optimizasyonu

## 📊 Başarı Kriterleri

- ✅ Tüm özellikler çalışır durumda
- ✅ Responsive tasarım (mobil, tablet, desktop)
- ✅ Dark mode tam destek
- ✅ Hatasız build
- ✅ TypeScript hataları yok
- ✅ Loading states ve error handling
- ✅ Performanslı (sayfa yükleme < 2s)
- ✅ Erişilebilirlik standartlarına uygun

## 🔄 Gelecek İyileştirmeler

- Okuma hedefleri belirleme
- Rozetler ve başarılar sistemi
- Sosyal paylaşım özellikleri
- Karşılaştırmalı istatistikler (diğer kullanıcılarla)
- Önerilen içerikler (AI tabanlı)
- Okuma listeleri oluşturma
- İçerik dışa aktarma (PDF, EPUB)

---

**Geliştirici**: Salih TANRISEVEN  
**AI Asistan**: Manus AI  
**Tarih**: 15 Kasım 2025  
**Proje**: HaberNexus - Profesyonel Profil Sayfası
