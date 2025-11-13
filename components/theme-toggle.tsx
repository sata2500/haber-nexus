"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.theme-toggle-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center rounded-lg p-2.5 hover:bg-accent/50 transition-all duration-200">
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  const themes = [
    { value: 'light', label: 'Açık', icon: Sun },
    { value: 'dark', label: 'Koyu', icon: Moon },
    { value: 'system', label: 'Sistem', icon: Monitor },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]
  const Icon = currentTheme.icon

  return (
    <div className="relative theme-toggle-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg p-2.5 hover:bg-accent/50 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Tema değiştir"
      >
        <Icon className="h-5 w-5 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card/95 backdrop-blur-xl shadow-xl ring-1 ring-border/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1.5">
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tema Seçimi</p>
            </div>
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon
              const isActive = theme === themeOption.value
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                >
                  <ThemeIcon className={`h-4 w-4 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                  <span>{themeOption.label}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
