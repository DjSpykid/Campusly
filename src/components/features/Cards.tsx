import Link from "next/link";
import Image from "next/image";
import { Card, Icon, Stars } from "@/components/ui";
import { naira } from "@/lib/utils";
import type { BusinessDTO, ProductDTO, ServiceDTO } from "@/types";

const tints = ["from-[#ece8fb] to-[#dcd5f7]", "from-[#fff1d6] to-[#ffd79a]", "from-[#dbeafe] to-[#c7d2fe]", "from-[#dcfce7] to-[#bbf7d0]", "from-[#ffe4e6] to-[#fecdd3]"];
const tintFor = (s: string) => tints[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % tints.length];

export function Thumb({ src, alt, seed, className = "h-44" }: { src?: string; alt: string; seed: string; className?: string }) {
  return src ? (
    <div className={`relative w-full overflow-hidden ${className}`}><Image src={src} alt={alt} fill unoptimized className="object-cover" /></div>
  ) : (
    <div className={`w-full bg-gradient-to-br ${tintFor(seed)} ${className}`} aria-hidden />
  );
}

export function ProductCard({ p }: { p: ProductDTO }) {
  return (
    <Link href={`/p/${p.id}`} className="block">
      <Card className="flex h-full flex-col overflow-hidden card-hover">
        <Thumb src={p.images[0]} alt={p.name} seed={p.id} />
        <div className="flex flex-col gap-1.5 p-4">
          <div className="font-semibold leading-tight">{p.name}</div>
          {p.businessName ? <div className="text-[13px] text-muted">{p.businessName}</div> : null}
          <div className="mt-1 flex items-center justify-between"><span className="text-[15px] font-bold">{naira(p.price)}</span>{!p.inStock ? <span className="text-xs text-muted">Out of stock</span> : null}</div>
        </div>
      </Card>
    </Link>
  );
}

export function ServiceCard({ s }: { s: ServiceDTO }) {
  return (
    <Link href={`/s/${s.id}`} className="block">
      <Card className="flex h-full flex-col overflow-hidden card-hover">
        <Thumb src={s.images[0]} alt={s.name} seed={s.id} className="h-36" />
        <div className="flex flex-col gap-1.5 p-4">
          <div className="flex items-start justify-between gap-2"><div className="font-semibold leading-tight">{s.name}</div><span className="flex shrink-0 items-center gap-1 text-xs text-muted"><Icon name="clock" size={12} />{s.durationMins} min</span></div>
          {s.businessName ? <div className="text-[13px] text-muted">{s.businessName}</div> : null}
          <div className="mt-1 flex items-center justify-between"><span className="text-[15px] font-bold">{naira(s.price)}</span><span className="rounded-[10px] bg-primary-light px-3 py-1.5 text-[13px] font-semibold text-primary">Book</span></div>
        </div>
      </Card>
    </Link>
  );
}

export function BusinessCard({ b }: { b: BusinessDTO }) {
  return (
    <Link href={`/b/${b.slug}`} className="block">
      <Card className="flex items-center gap-4 p-5 card-hover">
        <BusinessAvatar b={b} size={52} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold">{b.name}</div>
          <div className="truncate text-[13px] text-muted">{b.category}{b.location ? ` · ${b.location}` : ""}</div>
          <div className="mt-1 flex items-center gap-2"><Stars rating={b.ratingAvg} size={12} /><span className="text-xs text-muted">{b.ratingCount ? `${b.ratingAvg} · ${b.ratingCount} reviews` : "New"}</span></div>
        </div>
        <Icon name="chevron" size={18} className="text-muted" />
      </Card>
    </Link>
  );
}

export function BusinessAvatar({ b, size = 40 }: { b: { name: string; logoUrl?: string }; size?: number }) {
  const initials = b.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
  return b.logoUrl ? (
    <div className="relative shrink-0 overflow-hidden rounded-md" style={{ width: size, height: size }}><Image src={b.logoUrl} alt={b.name} fill unoptimized className="object-cover" /></div>
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-md bg-primary-light font-bold text-primary" style={{ width: size, height: size, fontSize: size * 0.32 }} aria-hidden>{initials}</div>
  );
}

export function Grid({ children, cols = 4 }: { children: React.ReactNode; cols?: 3 | 4 }) {
  return <div className={`stagger grid gap-5 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>{children}</div>;
}

export function Section({ title, sub, right, children }: { title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div><h2 className="text-[22px] font-bold">{title}</h2>{sub ? <p className="mt-1 text-muted">{sub}</p> : null}</div>
        {right}
      </div>
      {children}
    </section>
  );
}
