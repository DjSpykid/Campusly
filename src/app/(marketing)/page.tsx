import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Card, Icon, Stars, type IconName } from "@/components/ui";
import { discover } from "@/server/services/businesses";
import { Grid, ProductCard, ServiceCard } from "@/components/features/Cards";
import { CAMPUS_NAME } from "@/config/site";

const pillars: { title: string; body: string; icon: IconName; accent?: boolean; href: string }[] = [
  { title: "Buy", body: "Products from student sellers: food, fashion, tech, gifts.", icon: "cart", href: "/discover" },
  { title: "Book", body: "Real time slots for hair, nails, photos, tutoring, repairs.", icon: "calendar", href: "/discover?category=Nails" },
  { title: "Sell", body: "A free storefront or service profile in two minutes.", icon: "store", href: "/sell" },
  { title: "Earn", body: "Accept deliveries between classes and get paid per drop.", icon: "wallet", accent: true, href: "/deliver" },
];
const steps = [["Find it", "Search or browse categories. Every student business in one place."], ["Order or book", "Add to cart, or pick a real time slot. Pay securely in-app."], ["Get it", "A campus runner brings it to your hall, or you pick it up."], ["Rate it", "Reviews only from real orders, so trust is built in."]];

export default async function HomePage() {
  const { products, services } = await discover().catch(() => ({ products: [], services: [], businesses: [] }));
  return (
    <main className="mx-auto max-w-[1440px]">
      <section className="grid items-center gap-12 px-6 pb-16 pt-12 lg:grid-cols-2 lg:px-20 lg:pt-16">
        <div className="flex flex-col gap-6">
          <span className="animate-fade-up self-start rounded-pill bg-primary-light px-3.5 py-1.5 text-sm font-semibold text-primary">Now at {CAMPUS_NAME}</span>
          <h1 className="animate-fade-up delay-1 text-[44px] font-extrabold leading-[1.02] sm:text-5xl lg:text-[64px]">
            Your campus.<br />Your marketplace.<br /><span className="text-primary">Your hustle.</span>
          </h1>
          <p className="animate-fade-up delay-2 max-w-[520px] text-lg text-muted text-pretty">
            Every cake, braid, laptop fix and tutor on campus, all in one place. Buy from students, book students, sell to students, and earn delivering around campus.
          </p>
          <div className="animate-fade-up delay-3 flex flex-wrap gap-3">
            <ButtonLink href="/discover" size="lg">Explore your campus</ButtonLink>
            <ButtonLink href="/sell" variant="outline" size="lg">Start selling for free</ButtonLink>
          </div>
          <div className="animate-fade-up delay-4 flex items-center gap-3 text-sm text-muted">
            <div className="flex -space-x-2">{["/images/students-1.jpg", "/images/students-2.jpg", "/images/students-4.jpg"].map((s) => <span key={s} className="relative size-8 overflow-hidden rounded-pill border-2 border-surface"><Image src={s} alt="" fill className="object-cover" sizes="32px" /></span>)}</div>
            <span>{CAMPUS_NAME} students already buying, booking and earning</span>
          </div>
        </div>
        <div className="relative hidden h-[560px] lg:block">
          <div className="absolute left-0 top-8 w-[300px] animate-fade-up delay-2">
            <Card className="overflow-hidden shadow-[0_24px_60px_rgb(23_19_33/12%)]">
              <div className="relative h-[190px]"><Image src="/images/cake-1.jpg" alt="Chocolate drip cake" fill priority className="object-cover" sizes="300px" /></div>
              <div className="flex flex-col gap-1.5 p-4"><div className="font-semibold">Chocolate drip cake</div><div className="text-[13px] text-muted">Toke&apos;s Bakes · Hall 3</div><div className="mt-1 flex items-center justify-between"><span className="font-bold">₦12,000</span><Stars rating={5} size={12} /></div></div>
            </Card>
          </div>
          <div className="absolute right-0 top-0 w-[320px] animate-fade-up delay-3">
            <Card className="overflow-hidden shadow-[0_24px_60px_rgb(23_19_33/12%)]">
              <div className="relative h-[160px]"><Image src="/images/nails-1.jpg" alt="Gel nails" fill priority className="object-cover" sizes="320px" /></div>
              <div className="flex flex-col gap-1.5 p-4"><div className="flex items-center justify-between"><span className="font-semibold">Gel nails + art</span><span className="flex items-center gap-1 text-xs text-muted"><Icon name="clock" size={12} />90 min</span></div><div className="text-[13px] text-muted">Nails by Ama · Hostel B</div><div className="mt-1 flex items-center justify-between"><span className="font-bold">₦6,500</span><span className="rounded-[10px] bg-primary-light px-3 py-1.5 text-[13px] font-semibold text-primary">Book</span></div></div>
            </Card>
          </div>
          <div className="absolute bottom-10 right-10 w-[340px] animate-fade-up delay-4">
            <Card className="flex flex-col gap-3 p-5 shadow-[0_24px_60px_rgb(23_19_33/12%)]">
              <div className="flex items-center justify-between"><span className="font-semibold">Delivery to Hall 3, Rm 214</span><span className="rounded-pill bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary">on the way</span></div>
              <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-pill bg-accent text-[13px] font-bold">JK</div><div><div className="text-sm font-semibold">John K. is on the way</div><div className="text-xs text-muted">Runner · 4.9 · ~8 min</div></div><span className="ml-auto font-bold">₦500</span></div>
            </Card>
          </div>
          <div className="absolute bottom-28 left-20 flex animate-float items-center gap-2 rounded-pill bg-accent px-4 py-2.5 font-bold shadow-[0_10px_30px_rgb(255_184_77/40%)]"><Icon name="wallet" size={18} />You earned ₦12,400 this week</div>
        </div>
      </section>

      <section className="stagger grid gap-5 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4 lg:px-20">
        {pillars.map((p) => (
          <Link key={p.title} href={p.href}><Card className="card-hover flex h-full flex-col gap-3.5 p-7">
            <div className={`flex size-11 items-center justify-center rounded-md ${p.accent ? "bg-accent text-ink" : "bg-primary-light text-primary"}`}><Icon name={p.icon} size={22} /></div>
            <h3 className="text-[22px] font-bold">{p.title}</h3><p className="text-muted text-pretty">{p.body}</p>
          </Card></Link>
        ))}
      </section>

      {products.length ? <section className="flex flex-col gap-5 px-6 pb-20 lg:px-20"><div className="flex items-end justify-between"><div><h2 className="text-[28px] font-bold">Trending on campus</h2><p className="mt-1 text-muted">Real listings from real students.</p></div><Link href="/discover" className="flex items-center gap-1 font-semibold text-primary">See all <Icon name="chevron" size={16} /></Link></div><Grid>{products.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}</Grid></section> : null}
      {services.length ? <section className="flex flex-col gap-5 px-6 pb-20 lg:px-20"><div className="flex items-end justify-between"><div><h2 className="text-[28px] font-bold">Book a student pro</h2><p className="mt-1 text-muted">Real slots. No DM back-and-forth.</p></div><Link href="/discover?category=Nails" className="flex items-center gap-1 font-semibold text-primary">See all <Icon name="chevron" size={16} /></Link></div><Grid>{services.slice(0, 4).map((s) => <ServiceCard key={s.id} s={s} />)}</Grid></section> : null}

      <section className="px-6 pb-20 lg:px-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative h-[420px] overflow-hidden rounded-[24px]"><Image src="/images/students-4.jpg" alt="Students on campus" fill className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" /><div className="absolute bottom-6 left-6 text-white"><div className="text-2xl font-bold">Built for how campus actually works</div><div className="text-sm text-white/80">Hostels, lecture gaps, small tickets, trust through reviews.</div></div></div>
          <div className="stagger flex flex-col gap-4">
            {steps.map(([t, d], i) => <div key={t} className="flex gap-4 rounded-lg border border-border bg-surface p-5"><div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-primary font-display text-sm font-extrabold text-white">{i + 1}</div><div><div className="font-bold">{t}</div><div className="text-sm text-muted">{d}</div></div></div>)}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-20">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[24px] bg-ink p-10 text-white lg:grid-cols-2 lg:p-16">
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-pill bg-primary/40 blur-3xl" />
          <div className="relative flex flex-col gap-4">
            <h2 className="text-[32px] font-bold text-white lg:text-[36px]">Stop selling from your WhatsApp status.</h2>
            <p className="text-[#b8b3cc] text-pretty">Get found by every student on campus, take bookings without the back-and-forth, and get paid straight into the app. Free to join. We only earn when you do.</p>
            <div className="flex flex-wrap gap-3"><ButtonLink href="/sell" variant="accent" size="lg">Create your storefront</ButtonLink><ButtonLink href="/deliver" variant="ghost" size="lg" className="border border-[#3a3450] text-white hover:bg-[#221c33]">Become a runner</ButtonLink></div>
          </div>
          <div className="relative grid gap-4 sm:grid-cols-2">
            {[["Toke's Bakes", "Orders doubled in my first month."], ["Nails by Ama", "No more DM bookings clashing."], ["FixIt Campus", "Students find me without flyers."], ["John K., runner", "₦15k a week between lectures."]].map(([n, q]) => (
              <div key={n} className="flex flex-col gap-2 rounded-lg bg-[#221c33] p-5"><span className="text-[13px] font-semibold">{n}</span><p className="text-sm text-[#d9d5ea]">“{q}”</p></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
