# Gemini API Fiyatlandırma Araştırması

**Tarih**: 16 Kasım 2025  
**Kaynak**: https://ai.google.dev/gemini-api/docs/pricing

---

## Önemli Bulgular

### 1. Ücretsiz Tier (Free Tier)

**Gemini 2.5 Pro** için ücretsiz kullanım:

| Özellik | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Input price** | **Free of charge** | $1.25 (prompts ≤ 200k tokens)<br>$2.50 (prompts > 200k tokens) |
| **Output price** | **Free of charge** | $10.00 (prompts ≤ 200k tokens)<br>$15.00 (prompts > 200k tokens) |
| **Context caching** | Not available | $0.125 (≤ 200k tokens)<br>$0.25 (> 200k tokens)<br>$4.50 / 1M tokens per hour (storage) |
| **Grounding with Google Search** | Not available | 1,500 RPD (free), then $35 / 1,000 grounded prompts |
| **Grounding with Google Maps** | Not available | 10,000 RPD (free), then $25 / 1,000 grounded prompts |
| **Used to improve products** | Yes | No |

**Önemli Notlar**:
- ✅ **Input ve Output tamamen ücretsiz**
- ✅ **Sınırsız token kullanımı** (rate limit dahilinde)
- ⚠️ İçerik Google'ın ürünlerini geliştirmek için kullanılabilir
- ⚠️ Context caching ve grounding özellikleri yok

### 2. Gemini 2.5 Flash

**Daha hızlı ve hafif model** (1M token context window):

| Özellik | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Input price** | **Free of charge** | $0.075 (≤ 200k tokens)<br>$0.15 (> 200k tokens) |
| **Output price** | **Free of charge** | $0.30 (≤ 200k tokens)<br>$0.60 (> 200k tokens) |

### 3. Imagen 4 (Görsel Oluşturma)

**Fiyatlandırma**:
- **Free Tier**: Sınırlı kullanım (günlük/aylık kota)
- **Paid Tier**: ~$0.039 per image

**Kaynak**: https://ai.google.dev/gemini-api/docs/imagen

---

## Gemini Pro Aboneliği vs API

### Gemini Advanced Aboneliği ($19.99/month)

**Özellikler**:
- Gemini 2.5 Pro modeline tam erişim
- Daha yüksek rate limit
- 2 TB Google One depolama
- Gemini Apps (web, mobile) üzerinden kullanım

**Kaynak**: https://gemini.google/subscriptions/

### API Kullanımı

**Free Tier**:
- API key ile kullanım
- Google AI Studio erişimi
- Ücretsiz input/output tokens
- Rate limit: 15 RPM (requests per minute)

**Paid Tier**:
- Billing account bağlantısı gerekli
- Daha yüksek rate limit
- Context caching
- Grounding özellikleri

---

## Öneriler

### 1. Metin Üretimi için

**Önerilen Model**: `gemini-2.5-pro` (Free Tier)

**Avantajlar**:
- ✅ Tamamen ücretsiz
- ✅ Yüksek kalite
- ✅ Coding ve complex reasoning'de mükemmel
- ✅ Mevcut API key ile çalışıyor

**Dezavantajlar**:
- ⚠️ Rate limit: 15 RPM (günde ~21,600 request)
- ⚠️ İçerik Google'ın ürünlerini geliştirmek için kullanılabilir

### 2. Görsel Üretimi için

**Önerilen Model**: `imagen-4.0-generate-001`

**Durum**:
- ⚠️ Free tier sınırlı (günlük/aylık kota)
- ⚠️ Paid tier: $0.039 per image
- ⚠️ Yüksek kullanımda maliyet artabilir

**Alternatif**:
- Kaynak görselleri mümkün olduğunca kullan
- Cache mekanizması ekle
- Sadece yüksek kaliteli haberlerde görsel oluştur

### 3. Gemini Pro Aboneliği

**Kullanıcının Durumu**: 1 yıllık Gemini Pro aboneliği mevcut

**Önemli Not**: 
- ❌ Gemini Pro aboneliği **API kullanımını etkilemiyor**
- ❌ Abonelik sadece Gemini Apps (web, mobile) için
- ✅ API kullanımı için **Free Tier** kullanılabilir
- ✅ Ek ücret ödemeden API kullanımı mümkün

---

## Sonuç

**Önerilen Strateji**:

1. **Metin Üretimi**: `gemini-2.5-pro` (Free Tier) kullan
   - Tamamen ücretsiz
   - Yüksek kalite
   - Rate limit yeterli (15 RPM)

2. **Görsel Üretimi**: `imagen-4.0-generate-001` (Free Tier)
   - Günlük/aylık kota dahilinde kullan
   - Kaynak görselleri önceliklendir
   - Cache mekanizması ekle

3. **Maliyet Optimizasyonu**:
   - Kaynak görselleri mümkün olduğunca kullan
   - Benzer haberlerde görselleri yeniden kullan
   - Sadece yüksek kaliteli haberlerde görsel oluştur

**Tahmini Maliyet**: $0 (Free Tier dahilinde)
