# HaberNexus - Geliştirme Planı

## Mevcut Durum Analizi

### ✅ Tamamlanmış Özellikler (Faz 1-2)
- **Veritabanı Şeması**: Kapsamlı Prisma şeması (User, Article, Category, Tag, Comment, Like, Bookmark, Follow, Notification, RssFeed, AiTask vb.)
- **Kimlik Doğrulama**: NextAuth.js ile email/password ve Google OAuth
- **Temel Sayfalar**: Ana sayfa, giriş/kayıt sayfaları, admin dashboard
- **UI Bileşenleri**: Shadcn/ui ile temel bileşenler (Button, Card, Badge, Input vb.)
- **Layout**: Header ve Footer bileşenleri

### 🔧 Mevcut Sorunlar ve İyileştirmeler
1. ✅ **Prisma Client Generate Hatası**: Düzeltildi - postinstall script eklendi
2. **Middleware Deprecation**: Next.js 16'da middleware yerine proxy kullanılması öneriliyor
3. **Statik İçerik**: Ana sayfada hardcoded örnek veriler var
4. **Admin Paneli**: Sadece dashboard var, yönetim sayfaları eksik
5. **API Endpoints**: Sadece auth endpoints var, CRUD işlemleri eksik

---

## Faz 3: Temel İçerik Yönetim Sistemi

### Hedefler
Dinamik içerik yönetimi için gerekli API'ler ve admin panelini oluşturmak.

### Görevler

#### 3.1. Kategori Yönetimi
- [ ] `/api/categories` - CRUD endpoints
- [ ] `/admin/categories` - Kategori yönetim sayfası
- [ ] Kategori ekleme/düzenleme/silme formları
- [ ] Alt kategori desteği

#### 3.2. Makale Yönetimi
- [ ] `/api/articles` - CRUD endpoints
- [ ] `/admin/articles` - Makale listesi sayfası
- [ ] `/admin/articles/new` - Yeni makale oluşturma
- [ ] `/admin/articles/[id]/edit` - Makale düzenleme
- [ ] Rich text editor entegrasyonu (Tiptap veya Lexical)
- [ ] Görsel yükleme sistemi
- [ ] Taslak/Yayınla/Zamanla özellikleri

#### 3.3. Dinamik Makale Sayfaları
- [ ] `/articles/[slug]` - Makale detay sayfası
- [ ] `/categories/[slug]` - Kategori sayfası
- [ ] SEO optimizasyonu (metadata, og:tags)
- [ ] İlgili makaleler önerisi

#### 3.4. Ana Sayfa Dinamikleştirme
- [ ] Veritabanından gerçek makaleleri çekme
- [ ] Öne çıkan haber seçimi (featured flag)
- [ ] Son haberler listesi
- [ ] Kategori bazlı filtreleme

---

## Faz 4: AI Entegrasyonu ve RSS Sistemi

### Hedefler
Google Gemini API ile içerik üretimi ve RSS feed yönetimi.

### Görevler

#### 4.1. Google Gemini API Entegrasyonu
- [ ] API client kurulumu
- [ ] `/lib/ai/gemini.ts` - Gemini helper fonksiyonları
- [ ] Metin üretimi fonksiyonu
- [ ] Özet oluşturma fonksiyonu
- [ ] Tag önerisi fonksiyonu

#### 4.2. RSS Feed Yönetimi
- [ ] `/api/rss-feeds` - RSS feed CRUD endpoints
- [ ] `/admin/rss-feeds` - RSS feed yönetim sayfası
- [ ] RSS parser entegrasyonu
- [ ] Otomatik tarama sistemi (cron job)
- [ ] `/api/rss/scan` - Manuel tarama endpoint

#### 4.3. AI Destekli İçerik Üretimi
- [ ] RSS'den gelen haberleri AI ile analiz etme
- [ ] Kalite skorlama sistemi
- [ ] Otomatik özet oluşturma
- [ ] Otomatik tag önerisi
- [ ] İçerik yeniden yazma (rewrite)

#### 4.4. AI Görev Kuyruğu
- [ ] BullMQ veya basit job queue sistemi
- [ ] `/api/ai-tasks` - AI görev yönetimi
- [ ] Görev durumu takibi
- [ ] Hata yönetimi ve retry mekanizması

---

## Faz 5: Sosyal Özellikler ve Kullanıcı Etkileşimi

### Hedefler
Kullanıcıların içerikle etkileşime geçmesini sağlamak.

### Görevler

#### 5.1. Yorum Sistemi
- [ ] `/api/comments` - Yorum CRUD endpoints
- [ ] Makale sayfasında yorum bölümü
- [ ] İç içe yorumlar (reply)
- [ ] Yorum moderasyonu (admin)
- [ ] Spam koruması

#### 5.2. Beğeni ve Kaydetme
- [ ] `/api/likes` - Beğeni endpoint
- [ ] `/api/bookmarks` - Kaydetme endpoint
- [ ] Kullanıcı profil sayfasında kaydedilen makaleler
- [ ] Beğenilen makaleler listesi

#### 5.3. Takip Sistemi
- [ ] `/api/follows` - Takip endpoint
- [ ] Yazar profil sayfası
- [ ] Takip edilen yazarların makaleleri
- [ ] Takipçi/Takip edilen listeleri

#### 5.4. Bildirim Sistemi
- [ ] `/api/notifications` - Bildirim endpoints
- [ ] Header'da bildirim dropdown
- [ ] Gerçek zamanlı bildirimler (opsiyonel: WebSocket)
- [ ] Email bildirimleri (opsiyonel)

---

## Faz 6: Kullanıcı Deneyimi ve Optimizasyon

### Hedefler
Performans, SEO ve kullanıcı deneyimini iyileştirmek.

### Görevler

#### 6.1. Arama Sistemi
- [ ] `/api/search` - Arama endpoint
- [ ] Arama sayfası
- [ ] Gelişmiş filtreleme (kategori, tarih, yazar)
- [ ] Arama önerileri (autocomplete)

#### 6.2. Kullanıcı Profili
- [ ] `/profile` - Kullanıcı profil sayfası
- [ ] Profil düzenleme
- [ ] Yazar başvurusu sistemi
- [ ] Kullanıcı istatistikleri

#### 6.3. SEO ve Performans
- [ ] Sitemap.xml oluşturma
- [ ] robots.txt yapılandırması
- [ ] Open Graph ve Twitter Card metadata
- [ ] Image optimization
- [ ] Lazy loading
- [ ] ISR (Incremental Static Regeneration)

#### 6.4. Analytics ve Monitoring
- [ ] Görüntülenme sayısı takibi
- [ ] Popüler makaleler
- [ ] Trend analizi
- [ ] Hata loglama sistemi

---

## Faz 7: İleri Seviye Özellikler

### Hedefler
Platformu daha zengin ve profesyonel hale getirmek.

### Görevler

#### 7.1. Newsletter Sistemi
- [ ] Email listesi yönetimi
- [ ] Otomatik günlük/haftalık özet gönderimi
- [ ] Email template'leri
- [ ] Abonelik yönetimi

#### 7.2. Çoklu Dil Desteği
- [ ] i18n entegrasyonu
- [ ] Türkçe/İngilizce dil desteği
- [ ] Dil bazlı içerik yönetimi

#### 7.3. Gelişmiş Admin Paneli
- [ ] Dashboard analytics
- [ ] Kullanıcı yönetimi (ban, role değiştirme)
- [ ] Toplu işlemler
- [ ] Sistem ayarları sayfası

#### 7.4. Mobil Uygulama API'si
- [ ] REST API standardizasyonu
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Rate limiting
- [ ] API key sistemi

---

## Öncelikli Geliştirme Sırası (Sonraki Adımlar)

### 1. Middleware Güncelleme (Acil)
Next.js 16 uyarısını gidermek için middleware'i proxy'ye dönüştürme.

### 2. Kategori Sistemi (Yüksek Öncelik)
Temel kategori CRUD işlemleri ve admin paneli.

### 3. Makale Yönetimi (Yüksek Öncelik)
Makale oluşturma, düzenleme ve yayınlama sistemi.

### 4. Dinamik Sayfalar (Yüksek Öncelik)
Makale detay ve kategori sayfalarını dinamikleştirme.

### 5. AI Entegrasyonu (Orta Öncelik)
Google Gemini API ile temel özet ve tag üretimi.

### 6. RSS Sistemi (Orta Öncelik)
RSS feed ekleme ve tarama altyapısı.

---

## Teknik Notlar

### Kullanılacak Paketler
- **Rich Text Editor**: `@tiptap/react` veya `lexical`
- **RSS Parser**: `rss-parser`
- **Image Upload**: `uploadthing` veya `cloudinary`
- **Job Queue**: `bullmq` + Redis veya `pg-boss` (PostgreSQL tabanlı)
- **Email**: `nodemailer` veya `resend`
- **Search**: `@prisma/client` full-text search veya `meilisearch`

### Deployment Checklist
- [ ] Environment variables Vercel'de ayarlanmalı
- [ ] Database migration Vercel deployment'ta otomatik çalışmalı
- [ ] Build script'i her zaman `prisma generate` içermeli
- [ ] CORS ayarları yapılmalı (API için)
- [ ] Rate limiting eklenebilir

---

## Sonraki Sprint (Hemen Başlanacak)

1. **Middleware Güncelleme**: Next.js 16 proxy yapısına geçiş
2. **Kategori API ve Admin Sayfası**: Temel CRUD işlemleri
3. **Makale API**: Temel CRUD endpoints
4. **Rich Text Editor Entegrasyonu**: Tiptap kurulumu
5. **Makale Detay Sayfası**: Dinamik `/articles/[slug]` sayfası

Bu planı adım adım uygulayarak HaberNexus'u tam özellikli bir AI destekli haber platformuna dönüştüreceğiz.
