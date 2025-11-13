# Haber Nexus - Deployment Rehberi

Bu belge, Haber Nexus projesinin Vercel platformuna nasıl deploy edileceğini adım adım açıklar.

## 🎯 Ön Hazırlıklar

### 1. Gerekli Hesaplar ve API Anahtarları

Projeyi deploy etmeden önce aşağıdaki hesaplara ve API anahtarlarına ihtiyacınız olacak:

- **Vercel Hesabı:** [vercel.com](https://vercel.com) üzerinden ücretsiz hesap oluşturun
- **Google Cloud Console:** OAuth için Google Client ID ve Secret
- **OpenAI API Key:** İçerik üretimi için OpenAI API anahtarı
- **Vercel Postgres:** Vercel üzerinden ücretsiz PostgreSQL veritabanı

### 2. Google OAuth Ayarları

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client ID" seçin
5. Application type olarak "Web application" seçin
6. Authorized redirect URIs kısmına aşağıdaki URL'leri ekleyin:
   - `http://localhost:3000/api/auth/callback/google` (geliştirme için)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production için)
7. Client ID ve Client Secret bilgilerini kaydedin

## 🚀 Vercel'e Deployment

### Adım 1: GitHub Reposunu Vercel'e Bağlama

1. [Vercel Dashboard](https://vercel.com/dashboard) adresine gidin
2. "Add New Project" butonuna tıklayın
3. GitHub hesabınızı bağlayın ve `haber-nexus` reposunu seçin
4. "Import" butonuna tıklayın

### Adım 2: Ortam Değişkenlerini Ayarlama

Vercel proje ayarlarında "Environment Variables" bölümüne gidin ve aşağıdaki değişkenleri ekleyin:

```env
# NextAuth Ayarları
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate-a-random-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# OpenAI API
OPENAI_API_KEY=<your-openai-api-key>

# Database (Vercel Postgres'ten otomatik gelecek)
DATABASE_URL=<vercel-postgres-connection-string>
```

**Not:** `NEXTAUTH_SECRET` için güvenli bir rastgele string oluşturmak için şu komutu kullanabilirsiniz:
```bash
openssl rand -base64 32
```

### Adım 3: Vercel Postgres Ekleme

1. Vercel Dashboard'da projenizin "Storage" sekmesine gidin
2. "Create Database" > "Postgres" seçin
3. Veritabanı adını girin ve oluşturun
4. Vercel otomatik olarak `DATABASE_URL` ortam değişkenini projenize ekleyecektir

### Adım 4: Veritabanı Migrasyonu

Vercel'de veritabanı migrasyonlarını çalıştırmak için:

1. Vercel Dashboard'da projenizin "Settings" > "General" bölümüne gidin
2. "Build & Development Settings" kısmında "Build Command" alanını şu şekilde güncelleyin:
   ```
   npx prisma generate && npx prisma migrate deploy && next build
   ```

### Adım 5: Deploy

Tüm ayarlar tamamlandıktan sonra "Deploy" butonuna tıklayın. Vercel otomatik olarak projenizi build edip yayına alacaktır.

## 🔧 Deploy Sonrası Ayarlar

### İlk Admin Kullanıcısı Oluşturma

Deployment tamamlandıktan sonra, ilk admin kullanıcısını oluşturmak için:

1. Uygulamaya Google ile giriş yapın
2. Vercel Dashboard'dan "Storage" > "Postgres" > "Data" bölümüne gidin
3. `users` tablosunda kendi kullanıcınızı bulun
4. `role` alanını `ADMIN` olarak güncelleyin

Alternatif olarak, Prisma Studio kullanabilirsiniz:
```bash
npx prisma studio
```

### RSS Beslemeleri Ekleme

1. Admin olarak giriş yapın
2. Dashboard > RSS Beslemeleri bölümüne gidin
3. "Yeni RSS Kaynağı" butonuna tıklayın
4. Haber kaynaklarının RSS URL'lerini ekleyin

Örnek RSS kaynakları:
- TRT Haber: `https://www.trthaber.com/sondakika.rss`
- NTV: `https://www.ntv.com.tr/gundem.rss`
- BBC Türkçe: `https://feeds.bbci.co.uk/turkce/rss.xml`

## 🔄 Otomatik Deployment

GitHub reposuna her push yaptığınızda, Vercel otomatik olarak yeni bir deployment başlatacaktır. Bu sayede sürekli entegrasyon ve sürekli dağıtım (CI/CD) sağlanmış olur.

## 🐛 Sorun Giderme

### Build Hataları

Eğer build sırasında hata alırsanız:

1. Vercel Dashboard'da "Deployments" sekmesinden hatalı deployment'a tıklayın
2. "Build Logs" bölümünden hata mesajlarını inceleyin
3. Yerel makinenizde `npm run build` komutunu çalıştırarak hatayı test edin

### Veritabanı Bağlantı Hataları

- `DATABASE_URL` ortam değişkeninin doğru ayarlandığından emin olun
- Vercel Postgres bağlantı limitlerini kontrol edin
- Prisma migrasyonlarının başarıyla çalıştığından emin olun

### Authentication Hataları

- Google OAuth redirect URI'lerinin doğru ayarlandığından emin olun
- `NEXTAUTH_URL` değişkeninin production domain'inizi içerdiğinden emin olun
- `NEXTAUTH_SECRET` değişkeninin ayarlandığından emin olun

## 📊 İzleme ve Analitik

Vercel Dashboard üzerinden:
- Deployment loglarını izleyebilirsiniz
- Performans metriklerini görebilirsiniz
- Hata loglarını inceleyebilirsiniz
- Kullanım istatistiklerini takip edebilirsiniz

## 🎉 Tamamlandı!

Projeniz artık canlıda! Vercel tarafından sağlanan URL üzerinden erişebilirsiniz. Kendi domain'inizi bağlamak için Vercel Dashboard'da "Domains" bölümünü kullanabilirsiniz.
