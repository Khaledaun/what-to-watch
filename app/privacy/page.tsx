import { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy | What to Watch Tonight',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information.',
  robots: 'noindex, nofollow',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <div className="text-slate-300 space-y-4">
                <p>We collect information you provide directly to us, such as when you use our recommendation service, create an account, or contact us for support.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Streaming platform preferences</li>
                  <li>Movie and TV show preferences</li>
                  <li>Account information (if you choose to create an account)</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="text-slate-300 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide personalized movie and TV show recommendations</li>
                  <li>Improve our recommendation algorithms</li>
                  <li>Analyze usage patterns to enhance our service</li>
                  <li>Communicate with you about our service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
              <div className="text-slate-300 space-y-4">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                <p>We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With service providers who assist us in operating our website</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <div className="text-slate-300 space-y-4">
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                <p>However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <div className="text-slate-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Opt out of certain data processing activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="text-slate-300 space-y-4">
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p>Email: privacy@whattowatch.com</p>
                  <p>Last updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

