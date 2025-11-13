# HaberNexus - Proje Yapısı Dokümantasyonu

**Proje Adı:** HaberNexus  
**Geliştirici:** Salih TANRISEVEN  
**E-posta:** salihtanriseven25@gmail.com  
**GitHub:** https://github.com/sata2500/haber-nexus

---

## Genel Bakış

HaberNexus, yapay zeka destekli modern bir haber platformudur. Next.js 16, React 19, Tailwind CSS v4 ve Prisma ORM kullanılarak geliştirilmiştir. Platform, RSS beslemelerinden otomatik haber içeriği üretimi, kullanıcı yönetimi, yorum sistemi ve gelişmiş yönetim paneli özellikleri sunar.

---

## Dizin Yapısı

```
haber-nexus/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth.js kimlik doğrulama
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── comments/             # Yorum yönetimi API
│   │   │   └── route.ts
│   │   ├── posts/                # Haber içeriği API
│   │   │   └── route.ts
│   │   └── rss/                  # RSS besleme yönetimi
│   │       ├── fetch/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── dashboard/                # Yönetim Paneli
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard ana sayfa
│   │   ├── posts/                # Haber yönetimi
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── rss/                  # RSS kaynak yönetimi
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── haber/                    # Haber detay sayfaları
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── favicon.ico
│   ├── globals.css               # Global CSS ve tema değişkenleri
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Ana sayfa
├── components/                   # React Bileşenleri
│   ├── comment-section.tsx       # Yorum bölümü
│   ├── footer.tsx                # Footer bileşeni
│   ├── header.tsx                # Header ve navigasyon
│   ├── post-card.tsx             # Haber kartı
│   ├── providers.tsx             # Context providers wrapper
│   ├── theme-provider.tsx        # Tema provider
│   └── theme-toggle.tsx          # Tema değiştirme butonu
├── lib/                          # Utility fonksiyonlar
│   ├── auth.ts                   # NextAuth yapılandırması
│   ├── gemini.ts                 # Google Gemini AI entegrasyonu
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Yardımcı fonksiyonlar
├── prisma/                       # Veritabanı şeması ve migrasyonlar
│   ├── migrations/
│   │   ├── 20251113151340_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma             # Prisma şema tanımı
├── public/                       # Statik dosyalar
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── types/                        # TypeScript tip tanımları
│   └── next-auth.d.ts            # NextAuth tip genişletmeleri
├── .env                          # Ortam değişkenleri
├── eslint.config.mjs             # ESLint yapılandırması
├── next.config.ts                # Next.js yapılandırması
├── package.json                  # NPM bağımlılıkları
├── postcss.config.mjs            # PostCSS yapılandırması
├── prisma.config.ts              # Prisma yapılandırması
├── tailwind.config.ts            # Tailwind CSS yapılandırması
├── tsconfig.json                 # TypeScript yapılandırması
├── DEPLOYMENT.md                 # Deployment dokümantasyonu
├── LICENSE                       # MIT Lisansı
└── README.md                     # Proje README
```

---

## Temel Bileşenler

### 1. Kimlik Doğrulama Sistemi

**Dosyalar:**
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth.ts`
- `types/next-auth.d.ts`

**Özellikler:**
- Google OAuth entegrasyonu
- Kullanıcı rolleri: ADMIN, REPORTER, USER
- Session yönetimi
- JWT token kullanımı

**Kullanıcı Rolleri:**
- **ADMIN:** Tüm yönetim paneline erişim, kullanıcı yönetimi
- **REPORTER:** Haber oluşturma ve düzenleme, RSS yönetimi
- **USER:** Yorum yapma ve okuma

### 2. Haber Yönetim Sistemi

**Dosyalar:**
- `app/api/posts/route.ts`
- `app/dashboard/posts/page.tsx`
- `app/dashboard/posts/new/page.tsx`
- `components/post-card.tsx`

**Özellikler:**
- CRUD operasyonları
- Haber durumu: DRAFT, PUBLISHED
- Kategori sistemi
- Slug oluşturma
- Görüntülenme sayısı takibi
- Yazar bilgisi

### 3. RSS Besleme Sistemi

**Dosyalar:**
- `app/api/rss/route.ts`
- `app/api/rss/fetch/route.ts`
- `app/dashboard/rss/page.tsx`
- `lib/gemini.ts`

**Özellikler:**
- RSS kaynak ekleme ve yönetimi
- Otomatik haber çekme
- Google Gemini AI ile içerik üretimi
- Başlık ve özet oluşturma
- Kategori eşleştirme

### 4. Yorum Sistemi

**Dosyalar:**
- `app/api/comments/route.ts`
- `components/comment-section.tsx`

**Özellikler:**
- Haber yorumlama
- Yorum yanıtlama (nested comments)
- Kullanıcı bilgisi görüntüleme
- Tarih gösterimi

### 5. Tema Yönetimi

**Dosyalar:**
- `components/theme-provider.tsx`
- `components/theme-toggle.tsx`
- `app/globals.css`
- `tailwind.config.ts`

**Özellikler:**
- Light/Dark mode
- System tema desteği
- localStorage ile kalıcılık
- Smooth geçişler
- Tailwind CSS entegrasyonu

---

## Veritabanı Şeması

### User (Kullanıcı)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Post (Haber)
```prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  coverImage  String?
  status      Status    @default(DRAFT)
  viewCount   Int       @default(0)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### Category (Kategori)
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  posts       Post[]
  rssSources  RSSSource[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Comment (Yorum)
```prisma
model Comment {
  id        String    @id @default(cuid())
  content   String
  postId    String
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### RSSSource (RSS Kaynağı)
```prisma
model RSSSource {
  id          String    @id @default(cuid())
  name        String
  url         String    @unique
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  isActive    Boolean   @default(true)
  lastFetched DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## API Endpoints

### Kimlik Doğrulama
- `GET /api/auth/session` - Mevcut oturum bilgisi
- `POST /api/auth/signin` - Giriş yapma
- `POST /api/auth/signout` - Çıkış yapma

### Haberler
- `GET /api/posts` - Tüm haberleri listele
- `POST /api/posts` - Yeni haber oluştur (ADMIN/REPORTER)
- `PUT /api/posts` - Haber güncelle (ADMIN/REPORTER)
- `DELETE /api/posts` - Haber sil (ADMIN)

### Yorumlar
- `GET /api/comments?postId={id}` - Haber yorumlarını listele
- `POST /api/comments` - Yeni yorum ekle
- `DELETE /api/comments` - Yorum sil (ADMIN veya yorum sahibi)

### RSS
- `GET /api/rss` - RSS kaynaklarını listele
- `POST /api/rss` - Yeni RSS kaynağı ekle (ADMIN/REPORTER)
- `POST /api/rss/fetch` - RSS beslemelerini çek ve işle (ADMIN/REPORTER)

---

## Ortam Değişkenleri

```env
# Veritabanı
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
AUTH_SECRET="..."
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Google Gemini AI
GOOGLE_API_KEY="..."
GEMINI_API_KEY="..."

# Vercel Postgres (Opsiyonel)
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
```

---

## Geliştirme Komutları

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Production sunucusunu başlat
npm start

# Linting
npm run lint

# Prisma migrasyonları
npx prisma migrate dev
npx prisma migrate deploy
npx prisma generate
npx prisma studio
```

---

## Deployment

Proje Vercel platformuna deploy edilebilir. Detaylı deployment talimatları için `DEPLOYMENT.md` dosyasına bakınız.

### Vercel Deployment Adımları

1. GitHub reposunu Vercel'e bağla
2. Ortam değişkenlerini Vercel dashboard'dan ekle
3. Otomatik deployment için push yap
4. Production URL: https://habernexus.com

---

## Güvenlik

- NextAuth.js ile güvenli kimlik doğrulama
- CSRF koruması
- XSS koruması
- SQL injection koruması (Prisma ORM)
- Role-based access control (RBAC)
- Secure cookie kullanımı

---

## Performans Optimizasyonları

- Next.js Server Components
- Image optimization (next/image)
- Code splitting
- Lazy loading
- CDN kullanımı (Vercel)
- Database connection pooling (Neon)

---

## Gelecek Özellikler

1. **Arama Fonksiyonu:** Elasticsearch entegrasyonu
2. **Bildirim Sistemi:** Push notifications
3. **Sosyal Medya Paylaşımı:** Open Graph meta tags
4. **Analytics:** Google Analytics entegrasyonu
5. **Newsletter:** E-posta abonelik sistemi
6. **Çoklu Dil Desteği:** i18n entegrasyonu
7. **PWA Desteği:** Progressive Web App
8. **Reklam Yönetimi:** Google AdSense entegrasyonu

---

## Lisans

MIT License - Detaylar için `LICENSE` dosyasına bakınız.

---

## İletişim

**Geliştirici:** Salih TANRISEVEN  
**E-posta:** salihtanriseven25@gmail.com  
**GitHub:** https://github.com/sata2500
