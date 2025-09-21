export default function FAQ() {
  return (
    <div className="container mt-8 grid gap-3">
      <details className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
        <summary className="cursor-pointer text-[var(--gold)]">How do you choose picks?</summary>
        <p className="mt-2 text-sm text-text-muted">We balance runtime, ratings, mood fit, and availability.</p>
      </details>
      <details className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-4">
        <summary className="cursor-pointer text-[var(--gold)]">Is this available in my country?</summary>
        <p className="mt-2 text-sm text-text-muted">We show platforms for US/CA first; more regions coming soon.</p>
      </details>
    </div>
  );
}
