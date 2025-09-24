export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
        Frequently Asked Questions
      </h2>
      <div className="grid gap-4">
        <details className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <summary className="cursor-pointer text-[#E0B15C] font-semibold text-lg hover:text-[#F2C879] transition-colors">
            How do you choose my perfect picks?
          </summary>
          <p className="mt-3 text-gray-300">
            We use advanced AI to analyze your streaming services, mood, available time, and audience to find the perfect match. Our algorithm considers ratings, runtime, genre preferences, and current availability across all major platforms.
          </p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <summary className="cursor-pointer text-[#E0B15C] font-semibold text-lg hover:text-[#F2C879] transition-colors">
            Is this available in my country?
          </summary>
          <p className="mt-3 text-gray-300">
            We currently show availability for US and Canada. We're working on expanding to more regions soon. The recommendations are still valuable for discovering great content you can find on your local platforms.
          </p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <summary className="cursor-pointer text-[#E0B15C] font-semibold text-lg hover:text-[#F2C879] transition-colors">
            Why only 3 picks?
          </summary>
          <p className="mt-3 text-gray-300">
            We believe in quality over quantity. Three carefully curated picks save you time and decision fatigue. Each recommendation is tailored to your specific preferences and situation.
          </p>
        </details>
        <details className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
          <summary className="cursor-pointer text-[#E0B15C] font-semibold text-lg hover:text-[#F2C879] transition-colors">
            How often do you update the recommendations?
          </summary>
          <p className="mt-3 text-gray-300">
            Our database is updated daily with the latest releases and availability changes. Every time you use our service, you get the most current recommendations based on what's available right now.
          </p>
        </details>
      </div>
    </div>
  );
}
