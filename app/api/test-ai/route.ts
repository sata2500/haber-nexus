import { NextResponse } from "next/server"
import { generateText } from "@/lib/ai/gemini"

export async function GET() {
  try {
    const testPrompt = "Merhaba! Kısa bir test mesajı yaz (maksimum 50 kelime)."
    const result = await generateText(testPrompt, { temperature: 0.7 })
    
    return NextResponse.json({
      success: true,
      message: "AI test başarılı",
      result: result,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    console.error("AI test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
