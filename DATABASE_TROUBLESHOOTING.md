# Veritabanı Bağlantı Sorunu Giderme Kılavuzu

**Tarih:** 14 Kasım 2025  
**Sorun:** Payload CMS veritabanı şemasını çekerken takılıyor

## Sorun Detayı

Development server başlatıldığında `/admin` route'una erişildiğinde Payload CMS veritabanı şemasını çekmeye çalışıyor ancak bu işlem tamamlanmıyor ve sürekli "Pulling schema from database..." mesajı gösteriliyor.

```
[⣻] Pulling schema from database...
[⣽] Pulling schema from database...
[⣷] Pulling schema from database...
...
```

## Olası Nedenler

1. **Network Timeout:** Neon PostgreSQL sunucusuna bağlantı zaman aşımına uğruyor
2. **SSL Sertifika Sorunu:** SSL bağlantısında doğrulama hatası
3. **Connection Pooling:** PgBouncer pooling ayarları
4. **Veritabanı İzinleri:** Kullanıcının schema oluşturma yetkisi yok
5. **Firewall/Network:** Sandbox ortamından Neon'a erişim engelleniyor

## Çözüm Adımları

### 1. Veritabanı Bağlantısını Doğrudan Test Et

```bash
# PostgreSQL client yükle
sudo apt-get update
sudo apt-get install -y postgresql-client

# Bağlantıyı test et
psql "postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Başarılı olursa:
\dt  # Tabloları listele
\q   # Çık
```

### 2. SSL Modunu Değiştir

**.env dosyasını güncelle:**

```env
# Mevcut (sslmode=require)
DATABASE_URL=postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

# Alternatif 1: SSL'i tercih et ama zorunlu kılma
DATABASE_URL=postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=prefer

# Alternatif 2: SSL'i devre dışı bırak (sadece test için)
DATABASE_URL=postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=disable
```

### 3. Connection Timeout Ayarları

**payload.config.ts'yi güncelle:**

```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
    connectionTimeoutMillis: 30000, // 30 saniye
    idleTimeoutMillis: 30000,
    max: 10,
  },
}),
```

### 4. Unpooled Connection Kullan

**.env dosyasında:**

```env
# Pooled yerine direct connection kullan
DATABASE_URL=postgresql://neondb_owner:npg_4VmbZXDoMS2F@ep-late-cloud-ahrjqmr8.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 5. Manuel Migration Oluştur

```bash
# Migration dosyası oluştur
npx payload migrate:create

# Migration'ı çalıştır
npx payload migrate

# Veya doğrudan push et
npx payload migrate:push
```

### 6. Neon Dashboard Kontrolleri

1. https://console.neon.tech adresine git
2. Projeyi seç
3. **Connection Details** bölümünü kontrol et:
   - Connection string'in doğru olduğundan emin ol
   - IP whitelist varsa kaldır veya sandbox IP'sini ekle
4. **Database** sekmesinden:
   - Veritabanının aktif olduğunu kontrol et
   - Compute durumunu kontrol et (Auto-suspend kapalı olmalı)

### 7. Alternatif: Local PostgreSQL Kullan

**Docker ile local PostgreSQL:**

```bash
# PostgreSQL container başlat
docker run --name haber-nexus-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=habernexus \
  -p 5432:5432 \
  -d postgres:15

# .env dosyasını güncelle
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/habernexus
```

### 8. Drizzle Kit ile Manuel Schema Push

```bash
# Drizzle kit yükle
npm install -D drizzle-kit

# Schema'yı push et
npx drizzle-kit push:pg
```

## Debug Modu

**Detaylı log için:**

```bash
# Debug mode ile başlat
DEBUG=payload:* npm run dev
```

## Hızlı Test Script'i

**test-db-connection.js oluştur:**

```javascript
import pg from 'pg'
const { Client } = pg

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

async function testConnection() {
  try {
    await client.connect()
    console.log('✅ Veritabanı bağlantısı başarılı!')
    
    const result = await client.query('SELECT NOW()')
    console.log('⏰ Sunucu zamanı:', result.rows[0].now)
    
    await client.end()
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message)
  }
}

testConnection()
```

**Çalıştır:**

```bash
node test-db-connection.js
```

## Vercel Deployment için Öneriler

Eğer Vercel'e deploy edecekseniz:

1. **Environment Variables:** Vercel dashboard'dan ekleyin
2. **Neon Integration:** Vercel marketplace'den Neon entegrasyonunu kullanın
3. **Connection Pooling:** Vercel Postgres Proxy kullanın

## Başarı Kriterleri

Sorun çözüldüğünde şunları göreceksiniz:

```bash
✓ Ready in 1737ms
○ Compiling /admin ...
✓ Compiled /admin in 5.2s
[17:14:32] INFO: Connected to Postgres database successfully
[17:14:32] INFO: Migrating database...
[17:14:33] INFO: Database migrated successfully
GET /admin 200 in 6500ms
```

## Yardım Kaynakları

- **Payload CMS Docs:** https://payloadcms.com/docs/database/postgres
- **Neon Docs:** https://neon.tech/docs/connect/connect-from-any-app
- **PostgreSQL Connection Strings:** https://www.postgresql.org/docs/current/libpq-connect.html

## İletişim

Sorun devam ederse:
- Neon support ile iletişime geçin
- Payload CMS Discord kanalına sorun
- GitHub Issues'da arama yapın

**Geliştirici:** Salih TANRISEVEN  
**Email:** salihtanriseven25@gmail.com
