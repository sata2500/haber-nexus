import { NextRequest, NextResponse } from "next/server"
import { ErrorLog } from "@/lib/error-logger"

/**
 * POST /api/errors
 * Endpoint for logging client-side errors
 */
export async function POST(request: NextRequest) {
  try {
    const errorLog: ErrorLog = await request.json()

    // Log to server console
    console.error("[Client Error]", {
      message: errorLog.message,
      severity: errorLog.severity,
      timestamp: errorLog.timestamp,
      url: errorLog.url,
      context: errorLog.context,
    })

    // TODO: Send to external error tracking service
    // Example: await Sentry.captureException(errorLog)

    // TODO: Store in database for analytics
    // Example: await prisma.errorLog.create({ data: errorLog })

    return NextResponse.json(
      { success: true, message: "Error logged successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to process error log:", error)
    return NextResponse.json({ success: false, message: "Failed to log error" }, { status: 500 })
  }
}
