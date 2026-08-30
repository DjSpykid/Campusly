import Image from "next/image";
import { notFound } from "next/navigation";
import { getBusinessBySlug } from "@/server/services/businesses";
import { Avatar, Badge, Card, Icon, Stars } from "@/components/ui";
import { BusinessAvatar, Grid, ProductCard, Section, ServiceCard } from "@/components/features/Cards";
import { fmtDay } from "@/components/features/Stat";

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBusinessBySlug(slug);
  if (!data) notFound();
  const { business: b, products, services, reviews } = data;
  return (
    <div className="flex flex-col gap-7">
      <div className="relative -mx-6 -mt-8 h-52 overflow-hidden bg-gradient-to-br from-[#ece8fb] to-[#dcd5f7] lg:-mx-12 lg:h-64">{b.coverUrl ? <Image src={b.coverUrl} alt="" fill priority unoptimized className="object-cover" sizes="100vw" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" /></div>
      <div className="-mt-16 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="rounded-[24px] border-4 border-surface bg-surface shadow-[0_4px_16px_rgb(23_19_33/10%)]"><BusinessAvatar b={b} size={104} /></div>
        <div className="flex flex-1 flex-col gap-1.5 pb-2">
          <div className="flex flex-wrap items-center gap-3"><h1 className="text-[32px] font-bold">{b.name}</h1><Badge tone="success">Student business</Badge></div>
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted">
            <span className="flex items-center gap-1.5"><Icon name="pin" size={14} />{b.location || b.category}</span>
            <span className="flex items-center gap-1.5"><Stars rating={b.ratingAvg} size={13} />{b.ratingCount ? `${b.ratingAvg} · ${b.ratingCount} reviews` : "No reviews yet"}</span>
            <span>{b.category}</span>
          </div>
        </div>
        {b.contact.whatsapp ? <a href={`https://wa.me/${b.contact.whatsapp.replace(/\D/g, "").replace(/^0/, "234")}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-semibold">Message on WhatsApp</a> : null}
      </div>
      {b.description ? <p className="max-w-[720px] text-muted text-pretty">{b.description}</p> : null}
      {products.length ? <Section title={`Products (${products.length})`}><Grid>{products.map((p) => <ProductCard key={p.id} p={p} />)}</Grid></Section> : null}
      {services.length ? <Section title={`Services (${services.length})`}><Grid>{services.map((s) => <ServiceCard key={s.id} s={s} />)}</Grid></Section> : null}
      <Section title={`Reviews (${reviews.length})`} sub="From completed orders and bookings only">
        {reviews.length ? (
          <Grid cols={3}>{reviews.map((r) => (
            <Card key={r.id} className="flex flex-col gap-2.5 p-5">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><Avatar name={r.authorName} /><span className="font-semibold">{r.authorName}</span></div><span className="text-xs text-muted">{fmtDay(r.createdAt)}</span></div>
              <Stars rating={r.rating} size={13} />{r.text ? <p className="text-sm">{r.text}</p> : null}
            </Card>
          ))}</Grid>
        ) : <p className="text-sm text-muted">No reviews yet.</p>}
      </Section>
    </div>
  );
}
