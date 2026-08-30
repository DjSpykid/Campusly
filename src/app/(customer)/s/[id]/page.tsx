import Link from "next/link";
import { notFound } from "next/navigation";
import { getService } from "@/server/services/listings";
import { getSlots } from "@/server/services/bookings";
import { Icon, Stars } from "@/components/ui";
import { BusinessAvatar } from "@/components/features/Cards";
import { Gallery } from "@/components/features/Gallery";
import { naira } from "@/lib/utils";
import { BookingForm } from "./BookingForm";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const iso = (d: Date) => d.toISOString().slice(0, 10);

export default async function ServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  const { id } = await params;
  const { date } = await searchParams;
  const data = await getService(id).catch(() => null);
  if (!data) notFound();
  const { service: s, business: b } = data;
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const selected = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : iso(days[0]);
  const slots = await getSlots(s.id, selected);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-[13px] text-muted"><Link href="/discover">Discover</Link><Icon name="chevron" size={12} /><span>{s.category}</span><Icon name="chevron" size={12} /><span className="text-ink">{s.name}</span></div>
      <div className="grid gap-10 lg:grid-cols-[1fr_440px]">
        <div className="flex flex-col gap-5">
          <Gallery images={s.images} alt={s.name} seed={s.id} />
          <Link href={`/b/${b.slug}`} className="flex items-center gap-3"><BusinessAvatar b={b} /><div><div className="font-semibold text-ink">{b.name}</div><div className="flex items-center gap-1.5 text-xs text-muted"><Stars rating={b.ratingAvg} size={11} />{b.ratingCount ? `${b.ratingAvg} (${b.ratingCount})` : "New"}{b.location ? ` · ${b.location}` : ""}</div></div></Link>
          <h1 className="text-[34px] font-bold">{s.name}</h1>
          <div className="flex flex-wrap items-center gap-5"><span className="font-display text-[28px] font-extrabold">{naira(s.price)}</span><span className="flex items-center gap-1.5 text-sm text-muted"><Icon name="clock" size={16} />{s.durationMins} min</span>{b.location ? <span className="flex items-center gap-1.5 text-sm text-muted"><Icon name="pin" size={16} />{b.location}</span> : null}</div>
          {s.description ? <p className="text-muted text-pretty">{s.description}</p> : null}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm serviceId={s.id} price={s.price} durationMins={s.durationMins} slots={slots} selected={selected}
            days={days.map((d) => ({ iso: iso(d), label: DAYS[d.getDay()], num: d.getDate() }))} />
        </div>
      </div>
    </div>
  );
}
