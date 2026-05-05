import type { NextConfig } from 'next'

/**
 * Resolve Payload's hostname so production deployments don't have to remember
 * to update `remotePatterns`. Also accepts a comma-separated allowlist via
 * `NEXT_PUBLIC_IMAGE_HOSTS` for users who serve media from CDNs / S3 / etc.
 */
function imageRemotePatterns(): NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> {
  const patterns: NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> = [
    { protocol: 'http', hostname: 'localhost' },
    { protocol: 'https', hostname: '**.amazonaws.com' },
    { protocol: 'https', hostname: '**.cloudfront.net' },
    { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'cdn.shopify.com' },
  ]

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.PAYLOAD_API_URL
  if (apiUrl) {
    try {
      const u = new URL(apiUrl)
      patterns.push({
        protocol: (u.protocol.replace(':', '') || 'https') as 'http' | 'https',
        hostname: u.hostname,
      })
    } catch {
      // ignore — fall back to defaults
    }
  }

  const extra = process.env.NEXT_PUBLIC_IMAGE_HOSTS?.split(',').map((s) => s.trim()).filter(Boolean)
  for (const host of extra ?? []) {
    patterns.push({ protocol: 'https', hostname: host })
  }
  return patterns
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: imageRemotePatterns(),
  },
  experimental: {
    typedRoutes: false,
  },
}

export default nextConfig
