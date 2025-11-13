import { GoogleGenerativeAI } from "@google/generative-ai"

// Google Gemini API istemcisini oluştur
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function generateNewsContent(title: string, summary?: string) {
  try {
    // Gemini Pro modelini kullan
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Sen profesyonel bir gazeteci ve haber yazarısın. Aşağıdaki haber başlığı ve özeti için detaylı, objektif ve bilgilendirici bir haber içeriği oluştur.

Başlık: ${title}
${summary ? `Özet: ${summary}` : ""}

Lütfen aşağıdaki kriterlere uygun bir haber metni yaz:
1. Profesyonel ve objektif bir dil kullan
2. En az 500 kelime olsun
3. Giriş, gelişme ve sonuç bölümlerinden oluşsun
4. Konuyla ilgili bağlam ve arka plan bilgisi ver
5. Olası etkileri ve sonuçları değerlendir
6. Türkçe dilbilgisi kurallarına uy

Sadece haber metnini yaz, başlık veya ek açıklama ekleme.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text || ""
  } catch (error) {
    console.error("Error generating content with Gemini:", error)
    throw new Error("İçerik oluşturulurken bir hata oluştu")
  }
}

export async function generateNewsTitle(originalTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Aşağıdaki haber başlığını daha ilgi çekici, tıklanabilir ve profesyonel bir hale getir. Başlık Türkçe olmalı ve 100 karakteri geçmemelidir.

Orijinal başlık: ${originalTitle}

Sadece yeni başlığı yaz, açıklama ekleme.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim() || originalTitle
  } catch (error) {
    console.error("Error generating title with Gemini:", error)
    return originalTitle
  }
}

export async function generateExcerpt(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Aşağıdaki haber metninden 2-3 cümlelik özlü bir özet çıkar. Özet ilgi çekici ve bilgilendirici olmalı.

Metin: ${content.substring(0, 1000)}...

Sadece özeti yaz, açıklama ekleme.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text.trim() || ""
  } catch (error) {
    console.error("Error generating excerpt with Gemini:", error)
    return ""
  }
}
