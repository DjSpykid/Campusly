import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <rect width="64" height="64" rx="16" fill="#6c4cf1" />
      <path d="M22 27h20a2 2 0 0 1 2 2l1.4 16.2A3 3 0 0 1 42.4 48H21.6a3 3 0 0 1-3-2.8L20 29a2 2 0 0 1 2-2Z" fill="#fff" />
      <path d="M25.5 27v-3.5a6.5 6.5 0 0 1 13 0V27" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="44" cy="22" r="5" fill="#ffb84d" />
    </svg>
  );
}

export function Logo({ size = 32, light, href = "/" }: { size?: number; light?: boolean; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Campusly home">
      <LogoMark size={size} />
      <span className={cn("font-display font-extrabold tracking-tight", light ? "text-white" : "text-ink")} style={{ fontSize: Math.round(size * 0.72) }}>
        Campusly
      </span>
    </Link>
  );
}
