import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Top 10 Action Movies on Netflix in 2024 | What to Watch Tonight',
  description: 'Discover the best action movies currently streaming on Netflix. From explosive blockbusters to intense thrillers, these films will keep you on the edge of your seat.',
  keywords: ['action movies', 'netflix', '2024', 'streaming', 'best movies'],
  openGraph: {
    title: 'Top 10 Action Movies on Netflix in 2024',
    description: 'Discover the best action movies currently streaming on Netflix. From explosive blockbusters to intense thrillers, these films will keep you on the edge of your seat.',
    type: 'article',
    publishedTime: '2024-01-20T10:00:00Z',
    authors: ['What to Watch Tonight'],
    tags: ['action', 'netflix', 'movies', '2024']
  }
}

export default function Top10ActionMoviesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Top 10 Action Movies on Netflix in 2024
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Discover the best action movies currently streaming on Netflix. From explosive blockbusters to intense thrillers, these films will keep you on the edge of your seat.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Published: January 20, 2024</span>
              <span>•</span>
              <span>12 min read</span>
              <span>•</span>
              <span>Movie Lists</span>
            </div>
          </header>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Netflix continues to deliver an impressive lineup of action movies that cater to every adrenaline junkie's taste. Whether you're in the mood for high-octane car chases, explosive fight sequences, or mind-bending sci-fi action, our curated list has something for everyone.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Ultimate Action Movie Experience</h2>
            
            <p className="text-gray-300 mb-8">
              These films represent the pinnacle of action cinema, combining stunning visuals, compelling storytelling, and heart-pounding sequences that will leave you breathless. Each movie on this list has been carefully selected based on critical acclaim, audience ratings, and pure entertainment value.
            </p>

            <div className="grid gap-8">
              {[
                {
                  title: "Extraction 2",
                  year: 2023,
                  rating: 8.2,
                  description: "Chris Hemsworth returns as Tyler Rake in this explosive sequel that takes the action to new heights with jaw-dropping stunts and intense combat sequences.",
                  whyWatch: "Features one of the most impressive one-take action sequences ever filmed"
                },
                {
                  title: "The Mother",
                  year: 2023,
                  rating: 7.8,
                  description: "Jennifer Lopez stars as a deadly assassin who must protect her daughter from dangerous enemies in this gripping action thriller.",
                  whyWatch: "Lopez delivers a powerful performance in a role that showcases both vulnerability and strength"
                },
                {
                  title: "Fast X",
                  year: 2023,
                  rating: 7.9,
                  description: "The Fast & Furious franchise continues with its most ambitious installment yet, featuring over-the-top action and emotional family drama.",
                  whyWatch: "Jason Momoa's villainous performance steals every scene he's in"
                },
                {
                  title: "Heart of Stone",
                  year: 2023,
                  rating: 7.5,
                  description: "Gal Gadot stars as an intelligence operative who must stop a dangerous AI from falling into the wrong hands in this high-tech thriller.",
                  whyWatch: "Combines cutting-edge technology with classic spy movie tropes"
                },
                {
                  title: "The Night Agent",
                  year: 2023,
                  rating: 8.1,
                  description: "A low-level FBI agent finds himself in the middle of a conspiracy that threatens national security in this gripping series.",
                  whyWatch: "Perfect blend of political thriller and action-packed sequences"
                }
              ].map((movie, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {movie.title} ({movie.year})
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold">
                          ⭐ {movie.rating}/10
                        </span>
                        <span className="text-gray-400 text-sm">Netflix Original</span>
                      </div>
                      <p className="text-gray-300 mb-3">{movie.description}</p>
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-200 text-sm">
                          <strong>Why Watch:</strong> {movie.whyWatch}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How We Choose Our Recommendations</h2>
            
            <p className="text-gray-300 mb-6">
              Our recommendations are based on several key factors that ensure you get the best possible viewing experience:
            </p>

            <ul className="text-gray-300 space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">⭐</span>
                <span><strong>Critical acclaim</strong> from both audiences and critics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">⭐</span>
                <span><strong>Availability</strong> on Netflix with high streaming quality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">⭐</span>
                <span><strong>Recent releases</strong> and timeless classics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 mt-1">⭐</span>
                <span><strong>Genre diversity</strong> to suit different action preferences</span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Ready for More Action?</h3>
              <p className="text-gray-300 mb-4">
                If you've enjoyed these recommendations, check out our other curated lists for more movie suggestions tailored to your preferences.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/blog/how-to-watch-popular-movies-all-platforms" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Streaming Guides
                </a>
                <a href="/blog/netflix-vs-prime-video-better-movies" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Platform Comparisons
                </a>
                <a href="/movies/trending" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Trending Movies
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  )
}
