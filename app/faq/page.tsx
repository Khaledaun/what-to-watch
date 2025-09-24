import { Metadata } from 'next'
import { generateFAQStructuredData } from '@/lib/seo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - What to Watch',
  description: 'Get answers to common questions about finding movies and TV shows to watch. Learn how to use our recommendation engine and discover new content.',
  keywords: 'FAQ, frequently asked questions, movie recommendations, TV show recommendations, streaming, how to find movies',
  openGraph: {
    title: 'Frequently Asked Questions - What to Watch',
    description: 'Get answers to common questions about finding movies and TV shows to watch.',
    type: 'website',
  },
  alternates: {
    canonical: '/faq',
  },
}

const faqs = [
  {
    question: "How does the movie recommendation engine work?",
    answer: "Our recommendation engine uses advanced algorithms to analyze your preferences including streaming platforms, mood, available time, and audience preferences. It considers factors like genre, rating, release year, and popularity to suggest the perfect content for you."
  },
  {
    question: "Which streaming platforms are supported?",
    answer: "We support all major streaming platforms including Netflix, Amazon Prime Video, Disney+, Hulu, Max (HBO Max), Apple TV+, Paramount+, and Peacock. Our database is regularly updated with the latest content availability."
  },
  {
    question: "How often is the content database updated?",
    answer: "Our movie and TV show database is updated daily with new releases, ratings, and availability information. We also update streaming platform content regularly to ensure you get the most current recommendations."
  },
  {
    question: "Can I filter by specific genres or moods?",
    answer: "Yes! You can filter by genres like Action, Comedy, Drama, Horror, Romance, Sci-Fi, and more. We also offer mood-based filtering including 'Feel Good', 'Intense', 'Funny', 'Romantic', and 'Thought-Provoking' to match your current mood."
  },
  {
    question: "How do I find movies based on available time?",
    answer: "Simply select your available viewing time from options like 'Under 90 minutes', '2-3 hours', or 'Binge-watch session'. Our system will recommend content that fits perfectly within your time budget."
  },
  {
    question: "Are the recommendations personalized?",
    answer: "While we don't require user accounts, our recommendations are based on your current selections and preferences. The more you interact with our filters, the better we can tailor suggestions to your taste."
  },
  {
    question: "How accurate are the streaming availability listings?",
    answer: "We strive for high accuracy by regularly updating our database from multiple sources. However, streaming availability can change frequently, so we recommend double-checking with the streaming platform directly before subscribing."
  },
  {
    question: "Can I search for specific movies or TV shows?",
    answer: "Yes! Use our search feature to find specific titles, actors, directors, or keywords. You can also filter search results by type (movie/TV show), year, and other criteria."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Our website is fully optimized for mobile devices and works great on smartphones and tablets. We're currently working on dedicated mobile apps for iOS and Android."
  },
  {
    question: "How can I suggest a movie or TV show to be added?",
    answer: "We're always looking to expand our database! You can contact us through our support channels to suggest new content. We prioritize popular and highly-rated titles for addition."
  },
  {
    question: "Do you provide movie reviews or ratings?",
    answer: "We display ratings from The Movie Database (TMDB) and other trusted sources. We focus on helping you discover content rather than providing our own reviews, but we do show user ratings and critic scores."
  },
  {
    question: "Is the service free to use?",
    answer: "Yes! Our movie and TV show recommendation service is completely free. We don't require registration or payment. We may earn commissions from streaming platform referrals, but this doesn't affect our recommendations."
  }
]

export default function FAQPage() {
  const structuredData = generateFAQStructuredData(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Get answers to common questions about finding and watching movies and TV shows. 
              Learn how to make the most of our recommendation engine.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-white hover:text-purple-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-300 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Additional Help */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Still Have Questions?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 mb-4">
                  Can't find the answer you're looking for? We're here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Contact Support
                  </a>
                  <a
                    href="/blog"
                    className="border border-slate-600 text-white hover:bg-slate-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Read Our Blog
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
