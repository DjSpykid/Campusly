import { PageHeader } from "@/components/layout/Sidebar";
import { Badge, Card, EmptyState, Icon } from "@/components/ui";
import { Stat, Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { FEES } from "@/config/fees";
import { requireBusiness } from "../../business";
import { businessEarnings } from "@/server/services/earnings";

export default async function EarningsPage() {
  const { business } = await requireBusiness();
  const e = await businessEarnings(business.id);
  const max = Math.max(1, ...e.daily.map((d) => d.net));
  return (
    <>
      <PageHeader title="Earnings" sub="Every paid order and booking, and what you keep." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gross sales" value={naira(e.gross)} hint={`${e.count} transactions`} />
        <Stat label="Campusly commission" value={naira(e.commission)} hint={`${FEES.productCommissionRate * 100}% products · ${FEES.bookingCommissionRate * 100}% bookings`} />
        <Stat label="Net earnings" value={naira(e.net)} hint="Yours to keep" up={e.net > 0} />
        <Stat label="Net this week" value={naira(e.week)} hint="Last 7 days" />
      </div>
      <Card className="flex flex-col gap-4 p-6">
        <h3 className="font-bold">Daily net · last 14 days</h3>
        <div className="flex h-40 items-end gap-1.5">{e.daily.map((d, i) => <div key={d.date} title={`${d.date}: ${naira(d.net)}`} className={`flex-1 rounded-t-[4px] ${i === e.daily.length - 1 ? "bg-primary" : "bg-primary-light"}`} style={{ height: `${Math.max(3, (d.net / max) * 100)}%` }} />)}</div>
        <div className="flex justify-between text-xs text-muted"><span>{e.daily[0]?.date}</span><span>Today</span></div>
      </Card>
      {!e.transactions.length ? <EmptyState icon={<Icon name="wallet" size={32} />} title="No transactions yet" description="Paid orders and bookings appear here." /> : (
        <Card><Table head={["Type", "Customer", "Gross", "Commission", "Net", "Date"]}>{e.transactions.map((t) => (
          <tr key={t.id}><Td><Badge tone={t.refType === "order" ? "primary" : "warning"}>{t.refType}</Badge></Td><Td>{t.customerName ?? "-"}</Td><Td>{naira(t.gross)}</Td><Td className="text-muted">− {naira(t.commission)}</Td><Td className="font-bold text-green-700">{naira(t.net)}</Td><Td className="text-muted">{fmtDate(t.createdAt)}</Td></tr>
        ))}</Table></Card>
      )}
    </>
  );
}
