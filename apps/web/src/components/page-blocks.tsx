import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import type { StorefrontProduct } from '@nexify/types'
import { mediaUrl } from '@nexify/types'
import { ProductCard } from './product-card'
import { RichTextRenderer } from './rich-text'
import { listProducts } from '@/lib/api'

interface PayloadBlock {
  blockType?: string
  [key: string]: unknown
}

export async function PageBlocks({ blocks }: { blocks: PayloadBlock[] | null | undefined }) {
  if (!blocks || blocks.length === 0) return null
  const rendered: ReactNode[] = await Promise.all(
    blocks.map(async (block, idx): Promise<ReactNode> => {
      const key = `${block.blockType ?? 'unknown'}-${idx}`
      switch (block.blockType) {
        case 'hero':
          return <HeroBlock key={key} block={block} />
        case 'textContent':
          return <TextContentBlock key={key} block={block} />
        case 'imageText':
          return <ImageTextBlock key={key} block={block} />
        case 'productGrid':
          return await ProductGridBlock({ blockKey: key, block })
        case 'banner':
          return <BannerBlock key={key} block={block} />
        case 'testimonials':
          return <TestimonialsBlock key={key} block={block} />
        case 'cta':
          return <CtaBlock key={key} block={block} />
        case 'faq':
          return <FaqBlock key={key} block={block} />
        default:
          return null
      }
    }),
  )
  return <>{rendered}</>
}

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

function HeroBlock({ block }: { block: PayloadBlock }) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-20 text-white md:py-28">
      <div className="container-custom text-center">
        <h2 className="text-4xl font-bold md:text-6xl">{str(block.heading, 'Hero')}</h2>
        {!!block.subheading && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">{String(block.subheading)}</p>
        )}
        {!!(block.ctaLink && block.ctaText) && (
          <Link
            href={String(block.ctaLink)}
            className="btn-primary mt-8 bg-white !text-blue-700 hover:!bg-blue-50"
          >
            {String(block.ctaText)}
          </Link>
        )}
      </div>
    </section>
  )
}

function TextContentBlock({ block }: { block: PayloadBlock }) {
  return (
    <section className="container-custom max-w-3xl py-12">
      <div className="prose-storefront">
        <RichTextRenderer content={block.content} />
      </div>
    </section>
  )
}

function ImageTextBlock({ block }: { block: PayloadBlock }) {
  const image = mediaUrl(block.image as never)
  const heading = str(block.heading)
  const reverse = block.imagePosition === 'right'
  return (
    <section className="container-custom section-padding">
      <div
        className={`grid grid-cols-1 items-center gap-12 md:grid-cols-2 ${
          reverse ? 'md:[&>:first-child]:order-last' : ''
        }`}
      >
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
          {image && (
            <Image
              src={image}
              alt={heading}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          )}
        </div>
        <div>
          {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
          <div className="prose-storefront mt-4">
            <RichTextRenderer content={block.content} />
          </div>
        </div>
      </div>
    </section>
  )
}

async function ProductGridBlock({
  blockKey,
  block,
}: {
  blockKey: string
  block: PayloadBlock
}): Promise<ReactNode> {
  const limit = typeof block.limit === 'number' ? block.limit : 8
  const featured = block.source === 'featured'
  const response = await listProducts({ featured: featured || undefined, limit })
  const products: StorefrontProduct[] = response.docs

  if (products.length === 0) return null

  return (
    <section key={blockKey} className="section-padding">
      <div className="container-custom">
        {!!block.heading && <h2 className="mb-8 text-3xl font-bold">{String(block.heading)}</h2>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BannerBlock({ block }: { block: PayloadBlock }) {
  const image = mediaUrl(block.image as never)
  const heading = str(block.heading, '')
  return (
    <section className="container-custom my-12">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-12 text-white md:px-12 md:py-16">
        {image && (
          <Image
            src={image}
            alt={heading}
            fill
            sizes="100vw"
            className="absolute inset-0 -z-0 object-cover opacity-40"
            unoptimized
          />
        )}
        <div className="relative z-10 max-w-2xl">
          {heading && <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>}
          {!!block.subheading && <p className="mt-3 text-gray-200">{String(block.subheading)}</p>}
          {!!(block.ctaLink && block.ctaText) && (
            <Link href={String(block.ctaLink)} className="btn-primary mt-6 bg-white !text-gray-900">
              {String(block.ctaText)}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

interface Testimonial {
  quote?: string
  author?: string
  role?: string
}

function TestimonialsBlock({ block }: { block: PayloadBlock }) {
  const list = Array.isArray(block.testimonials) ? (block.testimonials as Testimonial[]) : []
  if (list.length === 0) return null
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {!!block.heading && (
          <h2 className="mb-10 text-center text-3xl font-bold">{String(block.heading)}</h2>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {list.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <blockquote className="text-gray-700">“{t.quote ?? ''}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.author ?? ''}</span>
                {t.role && <span className="text-gray-500"> — {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBlock({ block }: { block: PayloadBlock }) {
  return (
    <section className="section-padding bg-primary text-white">
      <div className="container-custom text-center">
        {!!block.heading && (
          <h2 className="text-3xl font-bold md:text-4xl">{String(block.heading)}</h2>
        )}
        {!!block.subheading && (
          <p className="mx-auto mt-3 max-w-2xl text-blue-100">{String(block.subheading)}</p>
        )}
        {!!(block.ctaLink && block.ctaText) && (
          <Link
            href={String(block.ctaLink)}
            className="btn-primary mt-6 bg-white !text-blue-700 hover:!bg-blue-50"
          >
            {String(block.ctaText)}
          </Link>
        )}
      </div>
    </section>
  )
}

interface FaqItem {
  question?: string
  answer?: string
}

function FaqBlock({ block }: { block: PayloadBlock }) {
  const items = Array.isArray(block.items) ? (block.items as FaqItem[]) : []
  if (items.length === 0) return null
  return (
    <section className="section-padding">
      <div className="container-custom max-w-3xl">
        {!!block.heading && <h2 className="mb-8 text-3xl font-bold">{String(block.heading)}</h2>}
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {items.map((item, i) => (
            <details key={i} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-gray-900">
                <span>{item.question ?? ''}</span>
                <span
                  aria-hidden
                  className="text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.answer ?? ''}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
