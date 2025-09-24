import { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'Accessibility Report | What to Watch Tonight',
  description: 'Our accessibility report and commitment to making our service accessible to all users.',
  robots: 'noindex, nofollow',
};

export default function AccessibilityReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Accessibility Report</h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment</h2>
              <div className="text-slate-300 space-y-4">
                <p>We are committed to making What to Watch Tonight accessible to all users, including those with disabilities. We strive to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 AA standards.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Accessibility Features</h2>
              <div className="text-slate-300 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Keyboard Navigation</h3>
                    <p>All interactive elements can be accessed using only a keyboard, with clear focus indicators.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Screen Reader Support</h3>
                    <p>Proper ARIA labels and semantic HTML ensure compatibility with screen readers.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Color Contrast</h3>
                    <p>All text meets WCAG AA contrast ratio requirements for readability.</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Responsive Design</h3>
                    <p>Our interface adapts to different screen sizes and devices.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Current Status</h2>
              <div className="text-slate-300 space-y-4">
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Implemented</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Skip links for keyboard navigation</li>
                    <li>Proper heading structure (H1, H2, H3)</li>
                    <li>Alt text for all images</li>
                    <li>Focus indicators for interactive elements</li>
                    <li>Semantic HTML structure</li>
                    <li>ARIA labels for form controls</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">🔄 In Progress</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Enhanced screen reader announcements</li>
                    <li>High contrast mode option</li>
                    <li>Text size adjustment controls</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Testing & Validation</h2>
              <div className="text-slate-300 space-y-4">
                <p>We regularly test our website for accessibility using:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Automated accessibility testing tools</li>
                  <li>Manual testing with screen readers</li>
                  <li>Keyboard-only navigation testing</li>
                  <li>Color contrast validation</li>
                  <li>User feedback and testing</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Feedback & Support</h2>
              <div className="text-slate-300 space-y-4">
                <p>If you encounter any accessibility barriers or have suggestions for improvement, please contact us:</p>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p>Email: accessibility@whattowatch.com</p>
                  <p>We aim to respond to accessibility feedback within 48 hours.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Accessibility Statement</h2>
              <div className="text-slate-300 space-y-4">
                <p>This accessibility report was last updated on {new Date().toLocaleDateString()}. We are committed to continuous improvement and will update this report as we implement new accessibility features.</p>
                <p>We welcome feedback from users with disabilities to help us improve our accessibility efforts.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

