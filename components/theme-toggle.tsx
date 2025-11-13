"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme

  const themes = [
    { value: "light", label: "Açık", icon: Sun },
    { value: "dark", label: "Koyu", icon: Moon },
    { value: "system", label: "Sistem", icon: Monitor },
  ]

  const currentThemeData = themes.find(t => t.value === theme) || themes[2]
  const CurrentIcon = currentThemeData.icon

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Tema seç"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isActive = theme === themeOption.value
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{themeOption.label}</span>
                  </div>
                  {isActive && <Check className="h-4 w-4" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
