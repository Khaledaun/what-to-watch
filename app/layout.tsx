import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { generateSoftwareApplicationLD, generateWebSiteLD } from '@/lib/structured-data'
import { PerformanceMonitor } from '@/components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'What to Watch Tonight - Movie & TV Recommendations',
  description: 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available. Find the perfect show to watch tonight.',
  keywords: 'movies, TV shows, recommendations, streaming, Netflix, Prime Video, Disney+, Hulu, Max, Apple TV+',
  authors: [{ name: 'What to Watch' }],
  creator: 'What to Watch',
  publisher: 'What to Watch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://whattowatch.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'What to Watch Tonight - Movie & TV Recommendations',
    description: 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available.',
    url: 'https://whattowatch.com',
    siteName: 'What to Watch',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'What to Watch Tonight',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What to Watch Tonight - Movie & TV Recommendations',
    description: 'Get personalized movie and TV show recommendations based on your streaming platforms, mood, and time available.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const softwareAppLD = generateSoftwareApplicationLD();
  const webSiteLD = generateWebSiteLD();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLD) }}
        />
      </head>
      <body className={inter.className}>
        <PerformanceMonitor />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
