"use client"

import { useEffect, useState } from "react"
import { errorLogger, ErrorLog } from "@/lib/error-logger"
import { AlertCircle, X, Trash2 } from "lucide-react"

/**
 * Development Error Dashboard
 * Shows all logged errors in development mode
 * Only visible when NODE_ENV is development
 */
export default function DevErrorDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<ErrorLog[]>([])

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    // Load logs from localStorage
    const loadLogs = () => {
      const stored = localStorage.getItem("error_logs")
      if (stored) {
        try {
          setLogs(JSON.parse(stored))
        } catch (err) {
          console.error("Failed to parse error logs:", err)
        }
      }
    }

    loadLogs()

    // Refresh logs every 2 seconds
    const interval = setInterval(loadLogs, 2000)

    return () => clearInterval(interval)
  }, [])

  const clearLogs = () => {
    errorLogger.clearLogs()
    setLogs([])
  }

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
        title="Error Dashboard (Dev Only)"
      >
        <AlertCircle className="h-6 w-6" />
        {logs.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-black">
            {logs.length}
          </span>
        )}
      </button>

      {/* Dashboard Panel */}
      {isOpen && (
        <div className="fixed right-4 bottom-20 z-50 h-96 w-96 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gray-50 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Error Dashboard</h3>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                Dev Only
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={clearLogs}
                className="rounded p-1 transition hover:bg-gray-200"
                title="Clear all logs"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 transition hover:bg-gray-200"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Logs List */}
          <div className="h-full overflow-y-auto p-3">
            {logs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>No errors logged</p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.reverse().map((log, index) => (
                  <div
                    key={index}
                    className={`rounded border p-2 text-xs ${getSeverityColor(log.severity)}`}
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <span className="font-semibold uppercase">{log.severity}</span>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mb-1 font-medium">{log.message}</p>
                    {log.stack && (
                      <details className="mt-1">
                        <summary className="cursor-pointer opacity-75">Stack trace</summary>
                        <pre className="mt-1 overflow-auto text-xs opacity-75">{log.stack}</pre>
                      </details>
                    )}
                    {log.context && (
                      <details className="mt-1">
                        <summary className="cursor-pointer opacity-75">Context</summary>
                        <pre className="mt-1 overflow-auto text-xs opacity-75">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
