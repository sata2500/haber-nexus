/**
 * Generate a detailed image generation prompt for article cover
 */
export function generateImagePrompt(title: string, excerpt: string, keywords: string[]): string {
  // Extract main subject from title and excerpt
  const mainSubject = title.split(":")[0].trim()

  // Determine image style based on keywords
  let style = "profesyonel haber fotoğrafı"
  let atmosphere = "gerçekçi ve bilgilendirici"

  // Adjust style based on content type
  if (keywords.some((k) => ["teknoloji", "bilim", "inovasyon"].includes(k.toLowerCase()))) {
    style = "modern teknoloji görseli"
    atmosphere = "fütüristik ve yenilikçi"
  } else if (keywords.some((k) => ["sağlık", "yaşam", "beslenme"].includes(k.toLowerCase()))) {
    style = "sağlık ve yaşam tarzı fotoğrafı"
    atmosphere = "temiz ve umut verici"
  } else if (keywords.some((k) => ["ekonomi", "finans", "piyasa"].includes(k.toLowerCase()))) {
    style = "iş ve finans görseli"
    atmosphere = "profesyonel ve güvenilir"
  } else if (keywords.some((k) => ["spor", "futbol", "basketbol"].includes(k.toLowerCase()))) {
    style = "dinamik spor fotoğrafı"
    atmosphere = "enerjik ve heyecan verici"
  }

  // Build comprehensive prompt
  const prompt = `${style}, ${mainSubject}, ${atmosphere} atmosfer, yüksek kalite, 8K çözünürlük, profesyonel aydınlatma, sinematik kompozisyon, detaylı ve net`

  return prompt
}

/**
 * Generate system prompt for content enrichment
 */
export function generateEnrichmentSystemPrompt(): string {
  return `Sen deneyimli bir gazetecisin ve içerik editörüsün. Görevin, verilen haber taslağını analiz edip, eksik bilgileri tespit etmek ve okuyucuya gerçek değer katacak şekilde zenginleştirmektir.

Zenginleştirme yaparken:
1. Haberin ana konusunu ve okuyucunun beklentilerini anla
2. Eksik olan pratik bilgileri, detayları ve bağlamı tespit et
3. Sağlanan araştırma kaynaklarını kullanarak özgün paragraflar yaz
4. Uzman görüşleri, istatistikler ve somut örnekler ekle
5. Okuyucunun "Peki şimdi ne yapmalıyım?" sorusuna cevap ver
6. İntihalden kaçın, her zaman kendi cümlelerini kur
7. Akıcı ve profesyonel bir üslup kullan

Amacın, yüzeysel bir haberi derinlemesine ve değerli bir makaleye dönüştürmektir.`
}

/**
 * Generate user prompt for content enrichment evaluation
 */
export function generateEnrichmentEvaluationPrompt(
  title: string,
  content: string,
  excerpt: string
): string {
  return `Aşağıdaki haber taslağını analiz et ve zenginleştirmeye ihtiyacı olup olmadığını değerlendir:

**Başlık:** ${title}

**Özet:** ${excerpt}

**İçerik:**
${content}

---

Bu haberi şu kriterlere göre değerlendir:
1. Okuyucuya pratik ve somut bilgi sunuyor mu?
2. Başlıkta vaat edilen bilgi tam olarak veriliyor mu?
3. "Nasıl?", "Neden?", "Ne yapmalı?" gibi sorulara cevap veriyor mu?
4. İçerik derinlemesine mi, yoksa sadece yüzeysel bir özet mi?

Cevabını şu JSON formatında ver:
{
  "enrichmentNeeded": true/false,
  "reasoning": "Kısa açıklama",
  "missingElements": ["Eksik olan bilgi 1", "Eksik olan bilgi 2", ...],
  "suggestedSearchQueries": ["Araştırma sorgusu 1", "Araştırma sorgusu 2", ...]
}`
}

/**
 * Generate user prompt for content enrichment writing
 */
export function generateEnrichmentWritingPrompt(
  title: string,
  originalContent: string,
  researchFindings: string,
  missingElements: string[]
): string {
  return `Sen bir uzman gazetecisin. Aşağıdaki haber taslağını, araştırma bulgularını kullanarak zenginleştir:

**Orijinal Başlık:** ${title}

**Orijinal İçerik:**
${originalContent}

**Eksik Olan Bilgiler:**
${missingElements.map((el, i) => `${i + 1}. ${el}`).join("\n")}

**Araştırma Bulguları:**
${researchFindings}

---

**Görevin:**
1. Orijinal içeriği koru, ama eksik bilgileri ekleyerek genişlet
2. Araştırma bulgularından yararlanarak özgün paragraflar yaz
3. Uzman görüşleri, istatistikler ve somut örnekler ekle
4. Okuyucuya pratik değer kat
5. Akıcı bir şekilde orijinal içerikle bütünleştir

**Önemli:** Sadece zenginleştirilmiş içeriğin TAM HALİNİ döndür. Açıklama veya yorum ekleme. Doğrudan makale metnini ver.`
}
