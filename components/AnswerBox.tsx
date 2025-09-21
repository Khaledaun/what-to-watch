export default function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mt-8">
      <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
        <p className="text-sm text-text/90">{children}</p>
      </div>
    </div>
  );
}
