import Image from "next/image";
import clsx from "clsx";

const providers: Record<string, string> = {
  netflix: "/icons/providers/netflix.svg",
  prime: "/icons/providers/prime.svg",
  "disney-plus": "/icons/providers/disney-plus.svg",
  hulu: "/icons/providers/hulu.svg",
  max: "/icons/providers/max.svg",
  "apple-tv-plus": "/icons/providers/apple-tv-plus.svg",
};

export function ProviderIcons({ items = [], className = "" }: { items: string[]; className?: string }) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {items.map((p) => (
        <span key={p} className="inline-flex h-5 w-5 opacity-85 hover:opacity-100 transition-opacity">
          <Image src={providers[p] ?? "/icons/providers/generic.svg"} alt={p} width={20} height={20} />
        </span>
      ))}
    </div>
  );
}
