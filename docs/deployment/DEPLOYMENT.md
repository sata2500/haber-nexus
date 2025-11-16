# Haber Nexus - Deployment Rehberi

Bu rehber, Haber Nexus projesini production ortamına deploy etmek için gerekli adımları içerir.

## Ön Gereksinimler

Projeyi deploy etmeden önce aşağıdaki servislere ihtiyacınız var:

1. **PostgreSQL Veritabanı** (Önerilen: [Neon](https://neon.tech/) veya [Supabase](https://supabase.com/))
2. **Google OAuth Credentials** ([Google Cloud Console](https://console.cloud.google.com/))
3. **Google Gemini API Key** ([Google AI Studio](https://makersuite.google.com/app/apikey))
4. **Vercel Hesabı** (Deployment için)

---

## 1. Veritabanı Kurulumu

### Neon (Önerilen)

Neon, serverless PostgreSQL veritabanı hizmeti sunar ve Next.js ile mükemmel uyum sağlar.

1. [Neon](https://neon.tech/) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Connection string'i kopyalayın (örnek: `postgresql://user:password@host/database?sslmode=require`)
4. `.env` dosyanıza ekleyin:
   ```
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

### Migration Çalıştırma

Veritabanı bağlantısını kurduktan sonra migration'ları çalıştırın:

```bash
pnpm prisma migrate deploy
```

---

## 2. Environment Variables

Aşağıdaki environment variable'ları ayarlamanız gerekiyor:

### Gerekli Değişkenler

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
AUTH_SECRET="your-auth-secret-here"  # openssl rand -base64 32
NEXTAUTH_URL="https://your-domain.com"
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini API
GOOGLE_API_KEY="your-google-api-key"
```

### Google OAuth Credentials Alma

1. [Google Cloud Console](https://console.cloud.google.com/) açın
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client ID" seçin
5. Application type: "Web application"
6. Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Client ID ve Client Secret'i kopyalayın

### Google Gemini API Key Alma

1. [Google AI Studio](https://makersuite.google.com/app/apikey) açın
2. "Get API Key" butonuna tıklayın
3. API key'i kopyalayın

---

## 3. Vercel Deployment

### Adım 1: Vercel Hesabı ve Proje Oluşturma

1. [Vercel](https://vercel.com/) hesabı oluşturun
2. GitHub hesabınızı bağlayın
3. "New Project" butonuna tıklayın
4. Haber Nexus repository'sini seçin

### Adım 2: Environment Variables Ekleme

Vercel dashboard'da:

1. Project Settings > Environment Variables bölümüne gidin
2. Yukarıdaki tüm environment variable'ları ekleyin
3. Her değişken için "Production", "Preview" ve "Development" ortamlarını seçin

### Adım 3: Build Settings

Vercel otomatik olarak Next.js projesini algılayacaktır. Default ayarlar:

- **Build Command**: `pnpm build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### Adım 4: Deploy

1. "Deploy" butonuna tıklayın
2. İlk deployment tamamlandığında domain'iniz hazır olacak
3. Custom domain eklemek için Project Settings > Domains bölümüne gidin

---

## 4. Post-Deployment Kontroller

Deployment tamamlandıktan sonra aşağıdaki kontrolleri yapın:

### Veritabanı Kontrolü

```bash
# Production veritabanına bağlan
pnpm prisma studio
```

### İlk Admin Kullanıcı Oluşturma

1. Uygulamaya giriş yapın (Google OAuth ile)
2. Veritabanında kullanıcı rolünü manuel olarak `ADMIN` veya `SUPER_ADMIN` yapın:

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-email@gmail.com';
```

### Test Edilmesi Gerekenler

- ✅ Ana sayfa yükleniyor mu?
- ✅ Giriş/Çıkış çalışıyor mu?
- ✅ Admin paneline erişim var mı?
- ✅ Kategori oluşturma çalışıyor mu?
- ✅ Makale oluşturma çalışıyor mu?
- ✅ RSS feed ekleme çalışıyor mu?
- ✅ RSS tarama çalışıyor mu?
- ✅ AI özellikleri çalışıyor mu?

---

## 5. RSS Feed Otomatik Tarama

RSS feedlerin otomatik olarak taranması için iki seçenek var:

### Seçenek 1: Vercel Cron Jobs (Önerilen)

Vercel Pro planı ile cron job'lar kullanabilirsiniz:

1. `vercel.json` dosyası oluşturun:

```json
{
  "crons": [
    {
      "path": "/api/rss-feeds/scan-all",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

2. Deploy edin

### Seçenek 2: External Cron Service

[Cron-job.org](https://cron-job.org/) gibi ücretsiz bir cron servisi kullanın:

1. Hesap oluşturun
2. Yeni cron job ekleyin:
   - URL: `https://your-domain.com/api/rss-feeds/scan-all`
   - Method: POST
   - Schedule: Her 6 saatte bir (0 _/6 _ \* \*)
   - Headers: `Authorization: Bearer YOUR_API_KEY` (opsiyonel)

---

## 6. Monitoring ve Logging

### Vercel Analytics

Vercel otomatik olarak analytics sağlar. Detaylı metrikleri görmek için:

1. Project Dashboard > Analytics
2. Web Vitals, page views ve diğer metrikleri görüntüleyin

### Error Tracking

Production hatalarını takip etmek için [Sentry](https://sentry.io/) entegre edebilirsiniz:

```bash
pnpm add @sentry/nextjs
```

---

## 7. Performance Optimizasyonu

### Image Optimization

Next.js otomatik olarak görselleri optimize eder. Ancak dış kaynaklardan gelen görseller için `next.config.ts` dosyasında domain'leri belirtmeniz gerekir (zaten yapıldı ✅).

### Caching

Vercel otomatik olarak static sayfaları cache'ler. ISR (Incremental Static Regeneration) kullanarak dinamik içeriği de cache'leyebilirsiniz.

---

## 8. Güvenlik

### Environment Variables

- ✅ Tüm hassas bilgiler environment variable'larda
- ✅ `.env` dosyası `.gitignore`'da
- ✅ Production ve development için ayrı değerler

### Database

- ✅ SSL bağlantısı zorunlu (`sslmode=require`)
- ✅ Güçlü şifreler kullanılıyor
- ✅ Database connection pooling aktif

### Authentication

- ✅ NextAuth.js ile güvenli kimlik doğrulama
- ✅ CSRF koruması
- ✅ Secure cookies

---

## 9. Backup Stratejisi

### Veritabanı Backup

Neon otomatik olarak backup alır. Manuel backup için:

```bash
pg_dump $DATABASE_URL > backup.sql
```

### Kod Backup

- ✅ GitHub repository
- ✅ Vercel otomatik deployment history

---

## 10. Troubleshooting

### Build Hatası

```bash
# Local'de build test et
pnpm build
```

### Database Connection Hatası

- Connection string'i kontrol edin
- SSL mode doğru mu? (`sslmode=require`)
- Firewall ayarları kontrol edin

### Environment Variables Yüklenmedi

- Vercel dashboard'da değişkenleri kontrol edin
- Redeploy yapın

---

## Sonuç

Deployment tamamlandı! Projeniz artık production'da çalışıyor.

**Önemli Linkler:**

- Production URL: `https://your-domain.com`
- Admin Panel: `https://your-domain.com/admin`
- Vercel Dashboard: `https://vercel.com/dashboard`
- GitHub Repository: `https://github.com/sata2500/haber-nexus`
