# Haber Nexus - Yapay Zeka Destekli Haber Platformu

![Haber Nexus](https://i.imgur.com/example.png) <!-- Replace with a real screenshot -->

Haber Nexus, Türkiye ve global pazarlar için tasarlanmış, son teknolojilerle donatılmış, yapay zeka destekli, interaktif ve modern bir haber ve içerik platformudur. Bu proje, sadece güncel haberleri sunmakla kalmaz, aynı zamanda kullanıcıların çeşitli konularda bilgi edinebileceği, tartışmalara katılabileceği ve kendi içeriklerini üretebileceği bir sosyal etkileşim alanı oluşturmayı hedefler.

Bu proje **Salih TANRISEVEN** adına geliştirilmiştir.

## ✨ Temel Özellikler

- **Modern Arayüz:** `Next.js` ve `Tailwind CSS` ile oluşturulmuş, hızlı, mobil uyumlu ve şık bir kullanıcı arayüzü.
- **Aydınlık/Karanlık Mod:** `next-themes` ile kullanıcı tercihine göre tema desteği.
- **Yapay Zeka Destekli İçerik:** `OpenAI API` kullanılarak RSS beslemelerinden otomatik olarak profesyonel haber içerikleri, başlıklar ve özetler üretilir.
- **Gelişmiş Yönetim Paneli (Dashboard):** Admin ve muhabirler için içerik yönetimi, RSS kaynağı yönetimi ve kullanıcı yönetimi (admin) arayüzleri.
- **Kimlik Doğrulama:** `NextAuth.js` ile Google üzerinden güvenli ve kolay giriş.
- **Kullanıcı Rolleri:** `ADMIN`, `REPORTER` ve `USER` olmak üzere üç farklı kullanıcı rolü ile yetkilendirme.
- **Etkileşim:** Kullanıcıların içeriklere yorum yapabilmesi ve birbirlerinin yorumlarına yanıt verebilmesi.
- **Veritabanı:** `Prisma` ORM ile yönetilen, `Vercel Postgres` üzerinde çalışan güçlü bir PostgreSQL veritabanı.

## 🚀 Teknoloji Stack

| Kategori | Teknoloji/Kütüphane | Açıklama |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) | React tabanlı, sunucu tarafı render ve statik site oluşturma yetenekleri sunan modern bir framework. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Hızlı ve modern arayüz geliştirmeyi sağlayan, "utility-first" bir CSS framework'ü. |
| **Veritabanı** | [PostgreSQL](https://www.postgresql.org/) ([Vercel Postgres](https://vercel.com/storage/postgres)) | Güçlü, ilişkisel ve ölçeklenebilir bir veritabanı çözümü. |
| **ORM** | [Prisma](https://www.prisma.io/) | Veritabanı şeması yönetimi ve sorgulamaları için modern ve tip güvenli bir araç. |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) | Google, e-posta/parola gibi çeşitli kimlik doğrulama yöntemlerini kolayca entegre etmek için. |
| **Yapay Zeka** | [Google Gemini API](https://ai.google.dev/gemini-api) | İçerik üretimi, özetleme, araştırma ve başlık oluşturma gibi görevler için. |
| **Deployment** | [Vercel](https://vercel.com/) | Next.js ile tam entegre, CI/CD süreçlerini otomatikleştiren ve global CDN sunan bir platform. |
| **UI Bileşenleri** | [Shadcn/ui](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/) | Erişilebilir ve özelleştirilebilir UI bileşenleri ve ikonlar. |
| **Tema Yönetimi** | [next-themes](https://github.com/pacocoursey/next-themes) | Aydınlık ve karanlık mod geçişlerini kolayca yönetmek için. |

## 🛠️ Kurulum ve Başlatma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Projeyi Klonlama

```bash
git clone https://github.com/sata2500/haber-nexus.git
cd haber-nexus
```

### 2. Bağımlılıkları Yükleme

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlama

Proje kök dizininde `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri kendi bilgilerinizle doldurun. `.env.example` dosyasını referans alabilirsiniz.

```env
# Veritabanı Bağlantısı (Vercel Postgres veya yerel PostgreSQL)
DATABASE_URL="YOUR_DATABASE_URL"

# NextAuth Ayarları
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
AUTH_SECRET="your-secret-key-here-change-in-production"

# Google OAuth Kimlik Bilgileri
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Google Gemini API Anahtarı
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 4. Veritabanı Migrasyonu

Prisma şemasını veritabanınıza uygulamak için aşağıdaki komutu çalıştırın.

```bash
npx prisma migrate dev
```

### 5. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

Uygulama artık [http://localhost:3000](http://localhost:3000) adresinde çalışıyor olacaktır.

## 📦 Build ve Deployment

Proje, Vercel platformuna kolayca deploy edilebilir. Vercel'e deploy etmeden önce, projenin hatasız bir şekilde build olduğundan emin olmak için aşağıdaki komutu çalıştırabilirsiniz.

```bash
npm run build
```

Bu komut, projenin production için optimize edilmiş bir versiyonunu oluşturur. Herhangi bir hata almazsanız, projenizi GitHub reponuz üzerinden Vercel'e bağlayarak otomatik olarak deploy edebilirsiniz.

## 🤝 Katkıda Bulunma

Bu proje Salih TANRISEVEN adına geliştirilmektedir. Katkıda bulunmak isterseniz, lütfen bir issue açın veya bir pull request gönderin.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.
