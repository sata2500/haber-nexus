"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code, Eye } from "lucide-react"
import { MarkdownEditor } from "./markdown-editor"
import { RichTextEditor } from "./rich-text-editor"
import { marked } from "marked"
import TurndownService from "turndown"

interface HybridEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

// Initialize turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
})

export function HybridEditor({ value, onChange, placeholder, minHeight = "400px" }: HybridEditorProps) {
  const [mode, setMode] = useState<'markdown' | 'wysiwyg'>('markdown')
  const [markdownContent, setMarkdownContent] = useState(value)
  const [htmlContent, setHtmlContent] = useState('')

  const switchToWysiwyg = async () => {
    // Convert markdown to HTML
    const html = await marked(markdownContent)
    setHtmlContent(html)
    setMode('wysiwyg')
  }

  const switchToMarkdown = () => {
    // Convert HTML to markdown
    const markdown = turndownService.turndown(htmlContent)
    setMarkdownContent(markdown)
    onChange(markdown)
    setMode('markdown')
  }

  const handleMarkdownChange = (newValue: string) => {
    setMarkdownContent(newValue)
    onChange(newValue)
  }

  const handleHtmlChange = (newValue: string) => {
    setHtmlContent(newValue)
    // Convert to markdown and update parent
    const markdown = turndownService.turndown(newValue)
    onChange(markdown)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'markdown' ? 'default' : 'outline'}
            size="sm"
            onClick={() => mode === 'wysiwyg' && switchToMarkdown()}
          >
            <Code className="h-4 w-4 mr-2" />
            Markdown
          </Button>
          <Button
            type="button"
            variant={mode === 'wysiwyg' ? 'default' : 'outline'}
            size="sm"
            onClick={() => mode === 'markdown' && switchToWysiwyg()}
          >
            <Eye className="h-4 w-4 mr-2" />
            Zengin Editör
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {mode === 'markdown' 
            ? 'Markdown formatında yazın' 
            : 'Görsel editör ile düzenleyin'}
        </p>
      </div>

      {mode === 'markdown' ? (
        <MarkdownEditor
          value={markdownContent}
          onChange={handleMarkdownChange}
          placeholder={placeholder}
          minHeight={minHeight}
        />
      ) : (
        <RichTextEditor
          value={htmlContent}
          onChange={handleHtmlChange}
          placeholder={placeholder}
          minHeight={minHeight}
        />
      )}

      <p className="text-xs text-muted-foreground">
        💡 İpucu: Markdown ve Zengin Editör arasında geçiş yapabilirsiniz. 
        İçerik otomatik olarak dönüştürülür.
      </p>
    </div>
  )
}
