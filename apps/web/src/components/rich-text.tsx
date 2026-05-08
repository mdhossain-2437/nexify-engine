/**
 * Minimal renderer for Payload's Lexical rich text shape.
 *
 * It walks the node tree and emits the most common node types: paragraph,
 * heading, list, link, blockquote, and text with bold/italic/underline marks.
 * Unknown nodes fall back to a `<div>` so content always renders even when
 * the schema evolves.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'

interface RichTextNode {
  type?: string
  tag?: string
  children?: RichTextNode[]
  text?: string
  format?: number | string
  fields?: { url?: string; newTab?: boolean; doc?: { value?: { slug?: string } } }
  url?: string
  listType?: 'number' | 'bullet'
}

interface RichTextRoot {
  root?: RichTextNode
}

interface RichTextRendererProps {
  content: unknown
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_UNDERLINE = 1 << 3
const FORMAT_CODE = 1 << 4

function hasRoot(value: unknown): value is RichTextRoot {
  return Boolean(value && typeof value === 'object' && 'root' in (value as object))
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  if (typeof content === 'string') {
    return <p>{content}</p>
  }
  if (!hasRoot(content) || !content.root) return null
  return <>{renderNode(content.root)}</>
}

function renderNode(node: RichTextNode, key?: string | number): ReactNode {
  if (!node) return null

  const children = (node.children ?? []).map((child, idx) =>
    renderNode(child, `${key ?? 'n'}-${idx}`),
  )

  switch (node.type) {
    case 'root':
      return <>{children}</>

    case 'paragraph':
      return (
        <p key={key} className="mb-4 leading-relaxed">
          {children}
        </p>
      )

    case 'heading': {
      const Tag = (
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag ?? '') ? node.tag : 'h2'
      ) as keyof React.JSX.IntrinsicElements
      return (
        <Tag key={key} className="mb-3 mt-6 font-bold tracking-tight">
          {children}
        </Tag>
      )
    }

    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      const cls = node.listType === 'number' ? 'list-decimal' : 'list-disc'
      return (
        <Tag key={key} className={`mb-4 space-y-1 pl-6 ${cls}`}>
          {children}
        </Tag>
      )
    }

    case 'listitem':
      return <li key={key}>{children}</li>

    case 'quote':
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-primary/40 bg-primary/5 px-4 py-2 italic text-gray-700"
        >
          {children}
        </blockquote>
      )

    case 'link': {
      const url = node.fields?.url || node.url || '#'
      const newTab = node.fields?.newTab
      const isInternal = url.startsWith('/')
      if (isInternal && !newTab) {
        return (
          <Link key={key} href={url} className="text-primary underline hover:no-underline">
            {children}
          </Link>
        )
      }
      return (
        <a
          key={key}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-primary underline hover:no-underline"
        >
          {children}
        </a>
      )
    }

    case 'horizontalrule':
      return <hr key={key} className="my-6 border-gray-200" />

    case 'text': {
      const format = typeof node.format === 'number' ? node.format : 0
      let element: ReactNode = node.text ?? ''
      if (format & FORMAT_BOLD) element = <strong>{element}</strong>
      if (format & FORMAT_ITALIC) element = <em>{element}</em>
      if (format & FORMAT_UNDERLINE) element = <u>{element}</u>
      if (format & FORMAT_CODE)
        element = <code className="rounded bg-gray-100 px-1 py-0.5 text-sm">{element}</code>
      return <span key={key}>{element}</span>
    }

    case 'linebreak':
      return <br key={key} />

    default:
      return <span key={key}>{children}</span>
  }
}
