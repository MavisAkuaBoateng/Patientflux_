import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ]
  },
}

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: '/sw.js',
})

export default pwaConfig(nextConfig)
