import Link from "next/link";
import { auth } from "@/lib/auth";
import { discover } from "@/server/services/businesses";
import { PRODUCT_CATEGORIES, SERVICE_CATEGORIES } from "@/config/categories";
import { CAMPUS_NAME } from "@/config/site";
import { Icon, EmptyState } from "@/components/ui";
import { BusinessCard, Grid, ProductCard, Section, ServiceCard } from "@/components/features/Cards";

export const metadata = { title: "Discover | Campusly" };
const CATS = ["All", ...PRODUCT_CATEGORIES.slice(0, 5), ...SERVICE_CATEGORIES.slice(0, 6)];

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "All" } = await searchParams;
  const [session, data] = await Promise.all([auth(), discover(q, category)]);
  const first = session?.user.name?.split(" ")[0];
  const empty = !data.products.length && !data.services.length && !data.businesses.length;
  const href = (c: string) => `/discover?${new URLSearchParams({ ...(q ? { q } : {}), ...(c !== "All" ? { category: c } : {}) })}`;
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-primary-light p-7 lg:flex-row lg:items-center lg:p-9">
        <div><h1 className="text-[30px] font-bold">What do you need today{first ? `, ${first}` : ""}?</h1><p className="mt-1.5 text-muted">Student businesses at {CAMPUS_NAME} · delivery to every hall</p></div>
        <form action="/discover" className="flex h-[52px] w-full items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 lg:w-[480px]">
          {category !== "All" ? <input type="hidden" name="category" value={category} /> : null}
          <Icon name="search" size={20} className="text-muted" />
          <input name="q" defaultValue={q} placeholder="Search cakes, nails, laptop repair…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted" />
        </form>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {CATS.map((c) => <Link key={c} href={href(c)} className={`inline-flex h-9 items-center rounded-pill border px-4 text-[13px] font-medium ${c === category ? "border-ink bg-ink text-white" : "border-border bg-surface hover:bg-bg"}`}>{c}</Link>)}
      </div>
      {empty ? <EmptyState icon={<Icon name="search" size={32} />} title={q ? `Nothing for “${q}” yet` : "No businesses yet"} description="Be the first to set up a storefront. It takes two minutes." action={<Link href="/sell" className="font-semibold text-primary">Start selling</Link>} /> : null}
      {data.products.length ? <Section title="Products" sub="From student sellers"><Grid>{data.products.map((p) => <ProductCard key={p.id} p={p} />)}</Grid></Section> : null}
      {data.services.length ? <Section title="Book a service" sub="Real slots, no DM back-and-forth"><Grid>{data.services.map((s) => <ServiceCard key={s.id} s={s} />)}</Grid></Section> : null}
      {data.businesses.length ? <Section title="Businesses"><Grid cols={3}>{data.businesses.map((b) => <BusinessCard key={b.id} b={b} />)}</Grid></Section> : null}
    </div>
  );
}
