import Link from "next/link";
import { Logo } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row lg:px-20">
        <div className="flex items-center gap-4">
          <Logo size={26} />
          <span className="text-[13px] text-muted">Buy. Book. Sell. Earn.</span>
        </div>
        <nav className="flex gap-6 text-[13px] text-muted">
          <Link href="/sell" className="hover:text-ink">Sellers</Link>
          <Link href="/deliver" className="hover:text-ink">Runners</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
