'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Hydration sonrası mounted state'ini güncelle
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Hydration hatalarını önlemek için
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Tema değiştir"
      >
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
  const CurrentIcon = currentTheme.icon

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Tema değiştir"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Overlay - dışarı tıklandığında menüyü kapat */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-popover rounded-lg shadow-lg border border-border py-1 z-20">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors ${
                  theme === value
                    ? 'text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {theme === value && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
