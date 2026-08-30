"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui";

const SLIDES = [
  { src: "/images/students-3.jpg", caption: "Every student business, one place" },
  { src: "/images/students-4.jpg", caption: "Book real slots. No DM back-and-forth" },
  { src: "/images/cake-1.jpg", caption: "Order from hostel kitchens and bakers" },
  { src: "/images/students-1.jpg", caption: "Earn between lectures as a runner" },
];
const WORDS = ["Buy.", "Book.", "Sell.", "Earn."];

export function AuthPanel({ campus }: { campus: string }) {
  const [i, setI] = useState(0);
  const [w, setW] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setW((x) => (x + 1) % WORDS.length), 2600); return () => clearInterval(t); }, []);
  return (
    <aside className="relative h-[240px] w-full overflow-hidden bg-ink text-white sm:h-[280px] lg:h-auto lg:min-h-screen">
      {SLIDES.map((s, k) => (
        <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
          <Image src={s.src} alt="" fill priority={k === 0} sizes="(min-width:1024px) 50vw, 100vw" className={`object-cover ${k === i ? "kenburns" : ""}`} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1140] via-[#1a1140]/55 to-[#1a1140]/10" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />

      <div className="relative flex h-full flex-col justify-between p-6 lg:p-12">
        <div className="flex items-center justify-between">
          <Logo size={30} light />
          <span className="hidden rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur sm:inline">{campus}</span>
        </div>
        <div className="flex flex-col gap-3 lg:gap-6">
          <h2 className="font-display text-[30px] font-extrabold leading-none tracking-tight text-white sm:text-[36px] lg:text-[56px]">
            <span key={w} className="word-cycle inline-block text-accent">{WORDS[w]}</span>
            <span className="ml-3 hidden text-white/90 sm:inline">Your campus.</span>
          </h2>
          <p key={i} className="animate-fade-up max-w-md text-sm text-white/85 lg:text-base">{SLIDES[i].caption}</p>
          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-3.5 pr-5 text-sm backdrop-blur">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-accent font-bold text-ink">TB</div>
              <div><div className="font-semibold">&ldquo;I sold 40 cakes my first week.&rdquo;</div><div className="text-xs text-white/70">Toke, Hall 3</div></div>
            </div>
            <div className="flex gap-1.5">{SLIDES.map((_, k) => <button key={k} type="button" aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className={`h-1.5 rounded-pill transition-all ${k === i ? "w-6 bg-accent" : "w-2 bg-white/40"}`} />)}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
