import { Metadata } from 'next'
import { TonightPage } from './TonightPage'

export const metadata: Metadata = {
  title: 'What to Watch Tonight - Movie & TV Recommendations',
  description: 'Find the perfect movie or TV show to watch tonight. Get personalized recommendations based on your streaming platforms and preferences.',
  alternates: {
    canonical: '/what-to-watch/tonight',
  },
  openGraph: {
    title: 'What to Watch Tonight - Movie & TV Recommendations',
    description: 'Find the perfect movie or TV show to watch tonight. Get personalized recommendations based on your streaming platforms and preferences.',
    url: '/what-to-watch/tonight',
  },
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Tonight() {
  return <TonightPage />
}

