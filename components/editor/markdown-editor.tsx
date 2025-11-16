/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import "easymde/dist/easymde.min.css"

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <div className="rounded-md border p-4">Editör yükleniyor...</div>,
})

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "İçeriğinizi markdown formatında yazın...",
  minHeight = "400px",
}: MarkdownEditorProps) {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value)
    },
    [onChange]
  )

  const options = useMemo(
    () =>
      ({
        spellChecker: false,
        placeholder,
        minHeight,
        maxHeight: "800px",
        autofocus: false,
        status: ["lines", "words", "cursor"] as any,
        toolbar: [
          "bold",
          "italic",
          "heading",
          "|",
          "quote",
          "unordered-list",
          "ordered-list",
          "|",
          "link",
          "image",
          "|",
          "preview",
          "side-by-side",
          "fullscreen",
          "|",
          "guide",
        ] as any,
        shortcuts: {
          toggleBold: "Cmd-B",
          toggleItalic: "Cmd-I",
          toggleHeadingSmaller: "Cmd-H",
          toggleHeadingBigger: "Shift-Cmd-H",
          cleanBlock: "Cmd-E",
          drawLink: "Cmd-K",
          drawImage: "Cmd-Alt-I",
          togglePreview: "Cmd-P",
          toggleSideBySide: "F9",
          toggleFullScreen: "F11",
        },
        previewRender: (plainText: string) => {
          // Simple markdown preview (you can enhance this with react-markdown)
          return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`
        },
      }) as any,
    [placeholder, minHeight]
  )

  return (
    <div className="markdown-editor-wrapper">
      <SimpleMDE value={value} onChange={handleChange} options={options} />
      <style jsx global>{`
        .markdown-editor-wrapper .EasyMDEContainer {
          border-radius: 0.375rem;
          position: relative;
          z-index: 1;
        }
        .markdown-editor-wrapper .CodeMirror-fullscreen {
          z-index: 9999 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          height: 100vh !important;
          width: 100vw !important;
        }
        .markdown-editor-wrapper .editor-toolbar.fullscreen {
          z-index: 9999 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
        }
        .markdown-editor-wrapper .editor-preview-side {
          z-index: 9998 !important;
        }
        .markdown-editor-wrapper .CodeMirror {
          border: 1px solid hsl(var(--border));
          border-radius: 0.375rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .markdown-editor-wrapper .CodeMirror-scroll {
          min-height: ${minHeight};
        }
        .markdown-editor-wrapper .editor-toolbar {
          border: 1px solid hsl(var(--border));
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
          background-color: hsl(var(--background));
        }
        .markdown-editor-wrapper .editor-toolbar button {
          color: hsl(var(--foreground));
        }
        .markdown-editor-wrapper .editor-toolbar button:hover {
          background-color: hsl(var(--accent));
          border-color: hsl(var(--accent));
        }
        .markdown-editor-wrapper .CodeMirror-sided {
          width: 50% !important;
        }
        .markdown-editor-wrapper .editor-preview {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .markdown-editor-wrapper .editor-preview-side {
          border-left: 1px solid hsl(var(--border));
          background-color: hsl(var(--background));
          position: fixed !important;
          width: 50% !important;
          height: 100% !important;
          top: 0 !important;
          right: 0 !important;
          z-index: 9 !important;
          overflow: auto !important;
        }
        .dark .markdown-editor-wrapper .CodeMirror {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .dark .markdown-editor-wrapper .CodeMirror-cursor {
          border-left-color: hsl(var(--foreground));
        }
      `}</style>
    </div>
  )
}
