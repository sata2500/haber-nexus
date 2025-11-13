import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateNewsContent(title: string, summary?: string) {
  try {
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sen profesyonel bir gazeteci ve haber yazarısın. Objektif, bilgilendirici ve ilgi çekici haberler yazarsın.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return completion.choices[0].message.content || ""
  } catch (error) {
    console.error("Error generating content with OpenAI:", error)
    throw new Error("İçerik oluşturulurken bir hata oluştu")
  }
}

export async function generateNewsTitle(originalTitle: string) {
  try {
    const prompt = `Aşağıdaki haber başlığını daha ilgi çekici, tıklanabilir ve profesyonel bir hale getir. Başlık Türkçe olmalı ve 100 karakteri geçmemelidir.

Orijinal başlık: ${originalTitle}

Sadece yeni başlığı yaz, açıklama ekleme.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Sen profesyonel bir haber başlığı yazarısın. İlgi çekici, bilgilendirici ve tıklanabilir başlıklar oluşturursun.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    })

    return completion.choices[0].message.content?.trim() || originalTitle
  } catch (error) {
    console.error("Error generating title with OpenAI:", error)
    return originalTitle
  }
}

export async function generateExcerpt(content: string) {
  try {
    const prompt = `Aşağıdaki haber metninden 2-3 cümlelik özlü bir özet çıkar. Özet ilgi çekici ve bilgilendirici olmalı.

Metin: ${content.substring(0, 1000)}...

Sadece özeti yaz, açıklama ekleme.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    })

    return completion.choices[0].message.content?.trim() || ""
  } catch (error) {
    console.error("Error generating excerpt with OpenAI:", error)
    return ""
  }
}
