"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui";

export function MobileNav({ links, loggedIn }: { links: readonly (readonly [string, string])[]; loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} className="flex size-10 items-center justify-center rounded-md hover:bg-bg">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-[72px] z-30 border-b border-border bg-surface p-4 shadow-lg animate-fade-in">
          <form action="/discover" className="mb-3 flex items-center gap-2 rounded-md border border-border px-3"><Icon name="search" size={18} className="text-muted" /><input name="q" placeholder="Search…" className="h-11 w-full bg-transparent text-sm outline-none" /></form>
          <nav className="flex flex-col">
            {links.map(([l, h]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-bg">{l}</Link>)}
            <Link href="/sell" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-bg">Start selling</Link>
            <Link href="/deliver" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-bg">Become a runner</Link>
            {!loggedIn ? <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold hover:bg-bg">Log in</Link> : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
