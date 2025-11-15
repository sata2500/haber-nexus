"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Sparkles } from "lucide-react"

interface InterestsSelectorProps {
  value: string[]
  onChange: (interests: string[]) => void
  suggestions?: string[]
}

const DEFAULT_SUGGESTIONS = [
  "Teknoloji",
  "Yapay Zeka",
  "Yazılım",
  "Bilim",
  "Sağlık",
  "Spor",
  "Ekonomi",
  "Finans",
  "Girişimcilik",
  "Eğitim",
  "Sanat",
  "Müzik",
  "Sinema",
  "Edebiyat",
  "Seyahat",
  "Yemek",
  "Moda",
  "Otomotiv",
  "Gayrimenkul",
  "Çevre",
  "Politika",
  "Dünya",
  "Gündem",
  "Kültür",
  "Tarih",
]

export function InterestsSelector({ 
  value, 
  onChange, 
  suggestions = DEFAULT_SUGGESTIONS 
}: InterestsSelectorProps) {
  const [inputValue, setInputValue] = useState("")
  
  // Use useMemo instead of useEffect to avoid setState in effect
  const availableSuggestions = useMemo(() => {
    // Filter out already selected interests
    return suggestions.filter(s => !value.includes(s))
  }, [value, suggestions])

  const handleAdd = (interest: string) => {
    const trimmed = interest.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue("")
    }
  }

  const handleRemove = (interest: string) => {
    onChange(value.filter(i => i !== interest))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputValue.trim()) {
        handleAdd(inputValue)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Selected Interests */}
      {value.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Seçili İlgi Alanları ({value.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {value.map((interest) => (
              <Badge
                key={interest}
                variant="default"
                className="pl-3 pr-1 py-1.5 gap-1"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(interest)}
                  className="ml-1 rounded-full hover:bg-primary-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Interest */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Yeni İlgi Alanı Ekle
        </label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Örn: Yapay Zeka, Blockchain..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => handleAdd(inputValue)}
            disabled={!inputValue.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ekle
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter tuşuna basarak veya Ekle butonuna tıklayarak ilgi alanı ekleyebilirsiniz
        </p>
      </div>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Önerilen İlgi Alanları
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 15).map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleAdd(suggestion)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {suggestion}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Önerilerden seçmek için tıklayın
          </p>
        </div>
      )}
    </div>
  )
}
