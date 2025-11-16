"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, X } from "lucide-react"

interface ImageInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export function ImageInput({ value, onChange, label, placeholder }: ImageInputProps) {
  const [preview, setPreview] = useState(value)

  const handleChange = (newValue: string) => {
    onChange(newValue)
    setPreview(newValue)
  }

  const handleClear = () => {
    onChange("")
    setPreview("")
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder || "https://example.com/image.jpg"}
          />
          {value && (
            <Button type="button" variant="outline" size="icon" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {preview && (
          <div className="bg-muted relative h-[300px] overflow-hidden rounded-lg border">
            <Image
              src={preview}
              alt="Önizleme"
              fill
              className="object-contain"
              onError={() => setPreview("")}
            />
          </div>
        )}

        {!preview && (
          <div className="bg-muted/50 rounded-lg border-2 border-dashed p-8 text-center">
            <ImageIcon className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm">
              Görsel URL&apos;sini yukarıya yapıştırın
            </p>
          </div>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Unsplash, Pexels gibi ücretsiz görsel sitelerinden URL kullanabilirsiniz
      </p>
    </div>
  )
}
