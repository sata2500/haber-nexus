import React, { Fragment } from 'react'

export function serialize(content: Record<string, any>): React.ReactNode {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  return content.root.children.map((node: any, index: number) => 
    serializeNode(node, index)
  )
}

function serializeNode(node: Record<string, any>, key: number): React.ReactNode {
  if (!node) return null

  // Text node
  if (node.text !== undefined) {
    let text: React.ReactNode = node.text

    if (node.format) {
      if (node.format & 1) { // Bold
        text = <strong key={key}>{text}</strong>
      }
      if (node.format & 2) { // Italic
        text = <em key={key}>{text}</em>
      }
      if (node.format & 4) { // Strikethrough
        text = <s key={key}>{text}</s>
      }
      if (node.format & 8) { // Underline
        text = <u key={key}>{text}</u>
      }
      if (node.format & 16) { // Code
        text = <code key={key}>{text}</code>
      }
    }

    return <Fragment key={key}>{text}</Fragment>
  }

  const children = node.children?.map((child: Record<string, any>, i: number) => 
    serializeNode(child, i)
  )

  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{children}</p>

    case 'heading': {
      const tag = node.tag || '2'
      const HeadingTag = `h${tag}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <HeadingTag key={key}>{children}</HeadingTag>
    }

    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return <ListTag key={key}>{children}</ListTag>

    case 'listitem':
      return <li key={key}>{children}</li>

    case 'quote':
      return <blockquote key={key}>{children}</blockquote>

    case 'link':
      return (
        <a 
          key={key} 
          href={node.url}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )

    case 'linebreak':
      return <br key={key} />

    case 'horizontalrule':
      return <hr key={key} />

    default:
      return <Fragment key={key}>{children}</Fragment>
  }
}
