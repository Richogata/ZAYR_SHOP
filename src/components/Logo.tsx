import Image from "next/image";
import Link from "next/link";
import { STORE } from "@/lib/config";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <Image
        src="/logo.png"
        alt={`${STORE.name} logo`}
        width={compact ? 40 : 52}
        height={compact ? 40 : 52}
        className="transition-transform group-hover:scale-105 rounded-full object-cover"
        priority
      />
      <div className="leading-tight">
        <span className="font-serif text-lg font-bold tracking-wide text-gold-600 md:text-xl">
          ZAYR
        </span>
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
          SHOP
        </span>
        {!compact && (
          <span className="hidden text-[10px] text-stone-500 sm:block">
            {STORE.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
