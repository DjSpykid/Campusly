import Link from "next/link";
import { PageHeader } from "@/components/layout/Sidebar";
import { ButtonLink, Card, Icon, StatusBadge, Stars } from "@/components/ui";
import { Stat, Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireBusiness } from "../business";
import { listBusinessOrders, productsSoldSummary } from "@/server/services/orders";
import { listBusinessBookings } from "@/server/services/bookings";
import { businessEarnings } from "@/server/services/earnings";

export default async function DashboardPage() {
  const { user, business: b } = await requireBusiness();
  const [orders, bookings, earnings, top] = await Promise.all([listBusinessOrders(b.id), listBusinessBookings(b.id), businessEarnings(b.id), productsSoldSummary(b.id)]);
  const open = orders.filter((o) => ["paid", "ready", "out_for_delivery"].includes(o.status));
  const upcoming = bookings.filter((x) => x.status === "confirmed").slice(0, 4);
  return (
    <>
      <PageHeader title={`Good day, ${user.name?.split(" ")[0]}`} sub={`Here's how ${b.name} is doing.`} actions={<>{b.type !== "services" ? <ButtonLink href="/dashboard/products?new=1"><Icon name="plus" size={18} />Add product</ButtonLink> : <ButtonLink href="/dashboard/services?new=1"><Icon name="plus" size={18} />Add service</ButtonLink>}</>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Net this week" value={naira(earnings.week)} hint={`${earnings.count} paid transactions`} up={earnings.week > 0} />
        <Stat label="Open orders" value={String(open.length)} hint={`${orders.length} total`} />
        <Stat label="Upcoming bookings" value={String(upcoming.length)} hint={`${bookings.length} total`} />
        <Stat label="Net earnings" value={naira(earnings.net)} hint="After commission" />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-border px-6 py-5"><h3 className="font-bold">Open orders</h3><Link href="/dashboard/orders" className="text-sm font-semibold text-primary">View all</Link></div>
          {open.length ? <Table head={["Order", "Customer", "Items", "Total", "Status"]}>{open.slice(0, 6).map((o) => <tr key={o.id}><Td className="font-semibold">#{o.id.slice(-6).toUpperCase()}</Td><Td>{o.customerName}</Td><Td className="text-muted">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</Td><Td>{naira(o.total)}</Td><Td><StatusBadge status={o.status} /></Td></tr>)}</Table> : <p className="p-6 text-sm text-muted">No open orders. New paid orders appear here.</p>}
        </Card>
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-3.5 p-6"><h3 className="font-bold">Upcoming bookings</h3>{upcoming.length ? upcoming.map((x) => <div key={x.id} className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-[10px] bg-primary-light text-primary"><Icon name="calendar" size={18} /></div><div className="flex-1"><div className="text-sm font-semibold">{x.serviceName}</div><div className="text-xs text-muted">{fmtDate(x.startAt)} · {x.customerName}</div></div></div>) : <p className="text-sm text-muted">Nothing booked yet.</p>}</Card>
          {top.length ? <Card className="flex flex-col gap-3 p-6"><h3 className="font-bold">Top products</h3>{top.map((t) => <div key={t.name} className="flex justify-between text-sm"><span>{t.name}</span><span className="text-muted">{t.qty} sold · <b className="text-ink">{naira(t.revenue)}</b></span></div>)}</Card> : null}
          <Card className="flex flex-col gap-2 bg-ink p-6 text-white"><div className="flex items-center justify-between"><span className="font-semibold">Store rating</span><Stars rating={b.ratingAvg} /></div><div className="font-display text-[32px] font-extrabold">{b.ratingCount ? b.ratingAvg : "-"} <span className="text-sm font-medium text-[#b8b3cc]">· {b.ratingCount} reviews</span></div></Card>
        </div>
      </div>
    </>
  );
}
