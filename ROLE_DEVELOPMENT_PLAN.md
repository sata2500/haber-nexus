# HaberNexus - Kullanıcı Rolleri ve Görevleri Geliştirme Planı

## Proje Analizi

### Mevcut Durum

**Teknoloji Stack:**
- Next.js 16 (App Router)
- TypeScript
- Prisma ORM + PostgreSQL (Neon)
- NextAuth.js (Kimlik Doğrulama)
- Tailwind CSS v4 + Shadcn/ui
- Google Gemini AI API

**Mevcut Kullanıcı Rolleri:**
1. `USER` - Normal kullanıcı
2. `AUTHOR` - Yazar
3. `EDITOR` - Editör
4. `ADMIN` - Yönetici
5. `SUPER_ADMIN` - Süper Yönetici

**Mevcut Özellikler:**
- ✅ Temel kimlik doğrulama (Email/Password + Google OAuth)
- ✅ Rol tabanlı erişim kontrolü (Middleware)
- ✅ Admin paneli (Dashboard, Kullanıcı, Makale, Kategori, RSS yönetimi)
- ✅ AI destekli içerik üretimi (Google Gemini)
- ✅ RSS feed tarama ve otomatik makale oluşturma
- ✅ İçerik taslakları (ContentDraft) sistemi
- ✅ Sosyal özellikler (Yorum, Beğeni, Takip, Bildirim)

### Eksik ve Geliştirilmesi Gereken Alanlar

#### 1. Yazar (AUTHOR) Rolü İçin Eksikler
- ❌ Yazara özel dashboard sayfası yok
- ❌ Yazar kendi makalelerini görüntüleyemiyor
- ❌ Yazar makale oluşturma/düzenleme arayüzü eksik
- ❌ Yazar taslak yönetimi arayüzü eksik
- ❌ Yazar profil yönetimi eksik
- ❌ Yazar istatistikleri (görüntülenme, beğeni vb.) eksik
- ❌ Yazar için içerik planlama/takvim özelliği yok

#### 2. Editör (EDITOR) Rolü İçin Eksikler
- ❌ Editöre özel dashboard yok
- ❌ Makale onay/reddetme sistemi yok
- ❌ Editör için makale düzenleme akışı eksik
- ❌ Yorum moderasyonu arayüzü yok
- ❌ İçerik kalite kontrol araçları eksik
- ❌ Editör için iş akışı yönetimi yok
- ❌ Editör notları/feedback sistemi yok

#### 3. Admin/Super Admin Rolleri İçin Eksikler
- ❌ Rol bazlı yetki detaylandırması eksik
- ❌ Sistem ayarları yönetimi yok
- ❌ Gelişmiş raporlama ve analitik eksik
- ❌ Toplu işlem özellikleri eksik
- ❌ Audit log sistemi yok

#### 4. Genel Sistem Eksikleri
- ❌ Rol bazlı API endpoint koruması eksik
- ❌ Yetki kontrol helper fonksiyonları eksik
- ❌ Rol geçiş bildirimleri yok
- ❌ Kullanıcı aktivite takibi eksik

## Detaylı Geliştirme Planı

### Faz 1: Yazar (AUTHOR) Rolü Geliştirmeleri

#### 1.1 Yazar Dashboard
**Dosya:** `/app/author/page.tsx`
**Özellikler:**
- Yazar istatistikleri (toplam makale, görüntülenme, beğeni, yorum)
- Son makaleler listesi
- Taslak makaleler özeti
- Performans grafikleri
- Hızlı erişim butonları (Yeni Makale, Taslaklar, Profilim)

#### 1.2 Yazar Makale Yönetimi
**Dosyalar:**
- `/app/author/articles/page.tsx` - Makale listesi
- `/app/author/articles/new/page.tsx` - Yeni makale oluşturma
- `/app/author/articles/[id]/edit/page.tsx` - Makale düzenleme
- `/app/author/articles/[id]/preview/page.tsx` - Makale önizleme

**Özellikler:**
- Filtreleme (Taslak, Yayında, Arşiv, Planlanmış)
- Arama ve sıralama
- Toplu işlemler (Arşivle, Sil)
- Makale durumu göstergeleri
- Yayınlama zamanı planlama

#### 1.3 Yazar Taslak Yönetimi
**Dosya:** `/app/author/drafts/page.tsx`
**Özellikler:**
- AI destekli taslak oluşturma
- Araştırma kaynakları yönetimi
- Taslak kalite skorları
- Taslaktan makaleye dönüştürme

#### 1.4 Yazar Profil Yönetimi
**Dosya:** `/app/author/profile/page.tsx`
**Özellikler:**
- Yazar bilgileri düzenleme
- Uzmanlık alanları
- Sosyal medya bağlantıları
- Yazar doğrulama durumu
- Portföy yönetimi

#### 1.5 Yazar İstatistikleri
**Dosya:** `/app/author/analytics/page.tsx`
**Özellikler:**
- Makale başına detaylı istatistikler
- Zaman bazlı performans grafikleri
- Okuyucu demografisi
- En popüler makaleler
- Engagement metrikleri

### Faz 2: Editör (EDITOR) Rolü Geliştirmeleri

#### 2.1 Editör Dashboard
**Dosya:** `/app/editor/page.tsx`
**Özellikler:**
- Onay bekleyen makaleler sayısı
- Günlük/haftalık iş yükü
- Editör performans metrikleri
- Hızlı erişim (Onay Bekleyenler, Yorumlar, Raporlar)

#### 2.2 Makale Onay Sistemi
**Dosyalar:**
- `/app/editor/review/page.tsx` - Onay bekleyen makaleler
- `/app/editor/review/[id]/page.tsx` - Makale inceleme sayfası

**Özellikler:**
- Makale kalite kontrol araçları
- AI destekli içerik analizi (dil bilgisi, okunabilirlik, SEO)
- Editör notları ve feedback
- Onaylama/Reddetme/Revizyon isteme
- Yazar ile iletişim sistemi

#### 2.3 Yorum Moderasyonu
**Dosya:** `/app/editor/moderation/page.tsx`
**Özellikler:**
- Bekleyen yorumlar listesi
- Spam/zararlı içerik tespiti
- Toplu onaylama/reddetme
- Kullanıcı engelleme
- Moderasyon geçmişi

#### 2.4 İçerik Planlama
**Dosya:** `/app/editor/calendar/page.tsx`
**Özellikler:**
- Takvim görünümü
- Yayın planlaması
- Yazar atama
- Kategori bazlı planlama
- Otomatik yayınlama

#### 2.5 Editör Raporları
**Dosya:** `/app/editor/reports/page.tsx`
**Özellikler:**
- İçerik kalite raporları
- Yazar performans raporları
- Kategori analizi
- Trend raporları

### Faz 3: Admin/Super Admin Geliştirmeleri

#### 3.1 Gelişmiş Kullanıcı Yönetimi
**Dosya:** `/app/admin/users/advanced/page.tsx`
**Özellikler:**
- Toplu rol değişikliği
- Kullanıcı aktivite geçmişi
- Hesap dondurma/aktifleştirme
- Kullanıcı grupları
- Yetki şablonları

#### 3.2 Sistem Ayarları
**Dosya:** `/app/admin/settings/page.tsx`
**Özellikler:**
- Genel site ayarları
- AI ayarları (model, parametreler)
- Email ayarları
- SEO ayarları
- Güvenlik ayarları

#### 3.3 Gelişmiş Analitik
**Dosya:** `/app/admin/analytics/page.tsx`
**Özellikler:**
- Detaylı trafik analizi
- Kullanıcı davranış analizi
- İçerik performans analizi
- Gelir raporları (gelecek için)
- Özel raporlar

#### 3.4 Audit Log Sistemi
**Dosya:** `/app/admin/audit/page.tsx`
**Özellikler:**
- Tüm sistem olaylarının kaydı
- Kullanıcı işlem geçmişi
- Güvenlik olayları
- Filtreleme ve arama
- Export özellikleri

### Faz 4: API ve Backend Geliştirmeleri

#### 4.1 Rol Bazlı API Endpoint Koruması
**Dosyalar:**
- `/lib/permissions.ts` - Yetki kontrol fonksiyonları
- `/lib/middleware/role-guard.ts` - API middleware

**Özellikler:**
- Rol bazlı erişim kontrol fonksiyonları
- Endpoint bazlı yetki tanımları
- Dinamik yetki kontrolü
- Hata yönetimi

#### 4.2 Yeni API Endpoints

**Yazar API'leri:**
- `GET /api/author/dashboard` - Dashboard verileri
- `GET /api/author/articles` - Yazar makaleleri
- `GET /api/author/analytics` - Yazar istatistikleri
- `POST /api/author/articles/submit` - Makale gönderimi

**Editör API'leri:**
- `GET /api/editor/pending` - Onay bekleyen makaleler
- `POST /api/editor/review/[id]/approve` - Makale onaylama
- `POST /api/editor/review/[id]/reject` - Makale reddetme
- `POST /api/editor/review/[id]/feedback` - Feedback gönderme
- `GET /api/editor/comments/pending` - Bekleyen yorumlar
- `POST /api/editor/comments/[id]/moderate` - Yorum moderasyonu

**Admin API'leri:**
- `GET /api/admin/analytics/advanced` - Gelişmiş analitik
- `POST /api/admin/users/bulk-update` - Toplu kullanıcı güncelleme
- `GET /api/admin/audit-logs` - Audit log kayıtları
- `POST /api/admin/settings` - Sistem ayarları

#### 4.3 Bildirim Sistemi Geliştirmeleri
**Dosya:** `/lib/notifications.ts`
**Özellikler:**
- Rol bazlı bildirimler
- Makale durumu değişikliği bildirimleri
- Editör feedback bildirimleri
- Sistem bildirimleri

### Faz 5: UI/UX İyileştirmeleri

#### 5.1 Ortak Bileşenler
**Dosyalar:**
- `/components/role-badge.tsx` - Rol rozeti
- `/components/article-status-badge.tsx` - Makale durum rozeti
- `/components/stats-card.tsx` - İstatistik kartı
- `/components/permission-guard.tsx` - Yetki kontrol bileşeni
- `/components/editor-feedback.tsx` - Editör feedback bileşeni

#### 5.2 Layout İyileştirmeleri
**Dosyalar:**
- `/components/layout/sidebar.tsx` - Rol bazlı sidebar
- `/components/layout/role-header.tsx` - Rol bazlı header
- `/app/author/layout.tsx` - Yazar layout
- `/app/editor/layout.tsx` - Editör layout

### Faz 6: Test ve Optimizasyon

#### 6.1 Test Senaryoları
- Rol bazlı erişim testleri
- API endpoint yetki testleri
- Workflow testleri
- Performance testleri

#### 6.2 Optimizasyon
- Database query optimizasyonu
- Caching stratejileri
- Lazy loading
- Code splitting

## Öncelik Sırası

### Yüksek Öncelik (Hemen Yapılacak)
1. ✅ Yazar dashboard ve makale yönetimi
2. ✅ Editör onay sistemi
3. ✅ Rol bazlı API koruması
4. ✅ Yetki kontrol fonksiyonları

### Orta Öncelik (Sonraki Sprint)
1. Yazar istatistikleri ve analitik
2. Editör yorum moderasyonu
3. İçerik planlama sistemi
4. Bildirim sistemi geliştirmeleri

### Düşük Öncelik (Gelecek)
1. Gelişmiş admin analitik
2. Audit log sistemi
3. Kullanıcı grupları
4. Özel raporlar

## Teknik Notlar

### Veritabanı Değişiklikleri
- `Article` modeline `editorId` ve `editorFeedback` alanları eklenecek
- `Article` modeline `submittedAt` ve `reviewedAt` alanları eklenecek
- Yeni `ArticleReview` modeli oluşturulacak (editör notları için)
- Yeni `AuditLog` modeli oluşturulacak

### Middleware Güncellemeleri
- Rol bazlı route koruması genişletilecek
- API endpoint koruması eklenecek
- Yetki kontrol middleware'i oluşturulacak

### Environment Variables
- Mevcut değişkenler yeterli
- Gelecekte email servisi için SMTP ayarları eklenebilir

## Sonuç

Bu plan, HaberNexus platformunun kullanıcı rolleri ve görevleri açısından tam işlevsel bir sisteme dönüşmesini sağlayacaktır. Her rol için özel dashboard, yönetim araçları ve iş akışları oluşturulacak, böylece platform profesyonel bir içerik yönetim sistemi haline gelecektir.
