import { Metadata } from 'next'
import { PlatformPage } from '../PlatformPage'

export const metadata: Metadata = {
  title: 'What to Watch on Netflix Tonight - Netflix Recommendations',
  description: 'Find the best movies and TV shows to watch on Netflix tonight. Get personalized Netflix recommendations based on your mood and time available.',
  alternates: {
    canonical: '/what-to-watch/on-netflix',
  },
  openGraph: {
    title: 'What to Watch on Netflix Tonight - Netflix Recommendations',
    description: 'Find the best movies and TV shows to watch on Netflix tonight. Get personalized Netflix recommendations based on your mood and time available.',
    url: '/what-to-watch/on-netflix',
  },
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function NetflixPage() {
  return <PlatformPage platform="netflix" />
}

