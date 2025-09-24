export default function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="text-gray-300">{children}</div>
    </div>
  );
}
