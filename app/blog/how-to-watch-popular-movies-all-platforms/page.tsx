import { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'How to Watch Popular Movies on All Streaming Platforms | What to Watch Tonight',
  description: 'Complete guide to finding and watching popular movies across streaming services. Learn how to find the best movies on Netflix, Prime Video, Disney+, and more.',
  keywords: ['streaming', 'movies', 'platforms', 'guide', 'netflix', 'prime video', 'disney plus'],
  openGraph: {
    title: 'How to Watch Popular Movies on All Streaming Platforms',
    description: 'Complete guide to finding and watching popular movies across streaming services.',
    type: 'article',
    publishedTime: '2024-01-19T15:30:00Z',
    authors: ['What to Watch Tonight'],
    tags: ['streaming', 'guide', 'movies', 'platforms']
  }
}

export default function HowToWatchPopularMoviesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How to Watch Popular Movies on All Streaming Platforms
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Complete guide to finding and watching popular movies on Netflix, Prime Video, Disney+, Hulu, and more streaming services.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Published: January 19, 2024</span>
              <span>•</span>
              <span>10 min read</span>
              <span>•</span>
              <span>Streaming Guides</span>
            </div>
          </header>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              With so many streaming platforms available today, finding your favorite movies can feel like searching for a needle in a haystack. This comprehensive guide will help you navigate the streaming landscape and discover where to watch the movies you love.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Streaming Platform Landscape</h2>
            
            <p className="text-gray-300 mb-8">
              Each streaming service has its own unique library and strengths. Understanding what each platform offers will help you make the most of your subscriptions and find the content you're looking for.
            </p>

            <div className="grid gap-6">
              {[
                {
                  name: "Netflix",
                  description: "The world's largest streaming service with a vast library of original content and licensed movies.",
                  strengths: ["Original series and movies", "International content", "Documentaries"],
                  popularMovies: ["Stranger Things", "The Crown", "Ozark", "Bridgerton"],
                  price: "$15.49/month"
                },
                {
                  name: "Prime Video",
                  description: "Amazon's streaming service included with Prime membership, featuring both original and licensed content.",
                  strengths: ["Included with Prime", "Original series", "Classic movies"],
                  popularMovies: ["The Boys", "Jack Ryan", "The Marvelous Mrs. Maisel", "Fleabag"],
                  price: "Included with Prime ($14.99/month)"
                },
                {
                  name: "Disney+",
                  description: "The home of Disney, Pixar, Marvel, Star Wars, and National Geographic content.",
                  strengths: ["Family-friendly", "Marvel & Star Wars", "Disney classics"],
                  popularMovies: ["The Mandalorian", "WandaVision", "Loki", "Encanto"],
                  price: "$7.99/month"
                },
                {
                  name: "Hulu",
                  description: "Known for next-day streaming of current TV shows and a growing library of original content.",
                  strengths: ["Current TV shows", "Original series", "Live TV option"],
                  popularMovies: ["The Handmaid's Tale", "Only Murders in the Building", "The Bear", "Dopesick"],
                  price: "$7.99/month"
                }
              ].map((platform, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {platform.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                      <p className="text-gray-300 mb-3">{platform.description}</p>
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">Key Strengths:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {platform.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">Popular Content:</h4>
                        <p className="text-gray-300 text-sm">{platform.popularMovies.join(", ")}</p>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-blue-200 text-sm">
                          <strong>Price:</strong> {platform.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Finding Movies Across Platforms</h2>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-200 mb-3">💡 Pro Tips for Movie Discovery</h3>
              <ul className="text-yellow-100 space-y-2">
                <li>• Use JustWatch or Reelgood to search across multiple platforms</li>
                <li>• Check our trending movies section for current popular titles</li>
                <li>• Follow your favorite actors and directors across platforms</li>
                <li>• Set up notifications for when movies become available</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Platform-Specific Search Tips</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Netflix</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Use the "New & Popular" section for trending content</li>
                  <li>• Browse by genre using the category menu</li>
                  <li>• Check "My List" for personalized recommendations</li>
                  <li>• Use the search bar with specific keywords</li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Prime Video</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Look for "Included with Prime" labels</li>
                  <li>• Browse the "Prime Originals" section</li>
                  <li>• Use the "Free to me" filter</li>
                  <li>• Check the "Channels" section for additional content</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Ready to Start Watching?</h3>
              <p className="text-gray-300 mb-4">
                Now that you know how to find movies across platforms, check out our other guides for more streaming tips and movie recommendations.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/blog/netflix-vs-prime-video-better-movies" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Platform Comparisons
                </a>
                <a href="/blog/top-10-action-movies-netflix-2024" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Movie Lists
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
