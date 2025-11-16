/**
 * Error Logger Utility
 * Centralized error logging and tracking
 */

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface ErrorLog {
  message: string
  stack?: string
  severity: ErrorSeverity
  context?: Record<string, unknown>
  timestamp: string
  userId?: string
  url?: string
  userAgent?: string
}

class ErrorLogger {
  private static instance: ErrorLogger
  private logs: ErrorLog[] = []
  private maxLogs = 100

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Log an error
   */
  log(
    error: Error | string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, unknown>
  ) {
    const errorLog: ErrorLog = {
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "string" ? undefined : error.stack,
      severity,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    }

    // Add to in-memory logs
    this.logs.push(errorLog)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${severity.toUpperCase()}]`, errorLog)
    }

    // Send to external service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(errorLog)
    }

    // Store in localStorage for debugging
    this.storeInLocalStorage(errorLog)
  }

  /**
   * Log a critical error
   */
  critical(error: Error | string, context?: Record<string, unknown>) {
    this.log(error, ErrorSeverity.CRITICAL, context)
  }

  /**
   * Log a high severity error
   */
  error(error: Error | string, context?: Record<string, unknown>) {
    this.log(error, ErrorSeverity.HIGH, context)
  }

  /**
   * Log a warning
   */
  warn(error: Error | string, context?: Record<string, unknown>) {
    this.log(error, ErrorSeverity.MEDIUM, context)
  }

  /**
   * Log an info message
   */
  info(error: Error | string, context?: Record<string, unknown>) {
    this.log(error, ErrorSeverity.LOW, context)
  }

  /**
   * Get all logs
   */
  getLogs(): ErrorLog[] {
    return this.logs
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = []
    if (typeof window !== "undefined") {
      localStorage.removeItem("error_logs")
    }
  }

  /**
   * Send error to external service (Sentry, LogRocket, etc.)
   */
  private sendToExternalService(errorLog: ErrorLog) {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(new Error(errorLog.message), { extra: errorLog })

    // For now, we can send to a custom API endpoint
    if (typeof window !== "undefined") {
      fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorLog),
      }).catch((err) => {
        console.error("Failed to send error to API:", err)
      })
    }
  }

  /**
   * Store error in localStorage for debugging
   */
  private storeInLocalStorage(errorLog: ErrorLog) {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem("error_logs")
      const logs = stored ? JSON.parse(stored) : []
      logs.push(errorLog)

      // Keep only last 50 logs in localStorage
      if (logs.length > 50) {
        logs.shift()
      }

      localStorage.setItem("error_logs", JSON.stringify(logs))
    } catch (err) {
      console.error("Failed to store error in localStorage:", err)
    }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance()

// Global error handler for unhandled errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    errorLogger.critical(event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.critical(event.reason, {
      type: "unhandledrejection",
      promise: event.promise,
    })
  })
}
