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
          h1: ({ ...props }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-2xl font-bold mt-4 mb-2" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="text-xl font-bold mt-3 mb-2" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="mb-4 leading-7" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="ml-4" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic bg-blue-50 dark:bg-blue-950/20"
              {...props}
            />
          ),
          code: ({ inline, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) =>
            inline ? (
              <code
                className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                {...props}
              />
            ),
          pre: ({ ...props }) => (
            <pre className="mb-4 overflow-x-auto" {...props} />
          ),
          a: ({ ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          img: ({ src, alt, width, height, ...props }) => (
            src && typeof src === 'string' ? (
              <Image
                src={src}
                alt={alt || ""}
                width={typeof width === 'number' ? width : 800}
                height={typeof height === 'number' ? height : 600}
                className="rounded-lg max-w-full h-auto my-4"
                loading="lazy"
                {...props}
              />
            ) : null
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
          ),
          tbody: ({ ...props }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props} />
          ),
          tr: ({ ...props }) => <tr {...props} />,
          th: ({ ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />
          ),
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
