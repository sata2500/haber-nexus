"use client"

import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Customize rendering of specific elements
          h1: ({ ...props }) => <h1 className="mt-8 mb-4 text-4xl font-bold" {...props} />,
          h2: ({ ...props }) => <h2 className="mt-6 mb-3 text-3xl font-bold" {...props} />,
          h3: ({ ...props }) => <h3 className="mt-4 mb-2 text-2xl font-bold" {...props} />,
          h4: ({ ...props }) => <h4 className="mt-3 mb-2 text-xl font-bold" {...props} />,
          p: ({ ...props }) => <p className="mb-4 leading-7" {...props} />,
          ul: ({ ...props }) => <ul className="mb-4 list-inside list-disc space-y-2" {...props} />,
          ol: ({ ...props }) => (
            <ol className="mb-4 list-inside list-decimal space-y-2" {...props} />
          ),
          li: ({ ...props }) => <li className="ml-4" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 italic dark:bg-blue-950/20"
              {...props}
            />
          ),
          code: ({ inline, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
            inline ? (
              <code
                className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm dark:bg-gray-800"
                {...props}
              />
            ) : (
              <code
                className="block overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm dark:bg-gray-800"
                {...props}
              />
            ),
          pre: ({ ...props }) => <pre className="mb-4 overflow-x-auto" {...props} />,
          a: ({ ...props }) => (
            <a
              className="text-blue-600 hover:underline dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          img: ({ src, alt, width, height, ...props }) =>
            src && typeof src === "string" ? (
              <Image
                src={src}
                alt={alt || ""}
                width={typeof width === "number" ? width : 800}
                height={typeof height === "number" ? height : 600}
                className="my-4 h-auto max-w-full rounded-lg"
                loading="lazy"
                {...props}
              />
            ) : null,
          table: ({ ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
          tbody: ({ ...props }) => (
            <tbody
              className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
              {...props}
            />
          ),
          tr: ({ ...props }) => <tr {...props} />,
          th: ({ ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              {...props}
            />
          ),
          td: ({ ...props }) => <td className="px-6 py-4 text-sm whitespace-nowrap" {...props} />,
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
          ),
          strong: ({ ...props }) => <strong className="font-bold" {...props} />,
          em: ({ ...props }) => <em className="italic" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
