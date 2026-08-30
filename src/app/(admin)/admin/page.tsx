import { PageHeader } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui";
import { Stat } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { adminStats } from "@/server/services/admin";

export default async function AdminPage() {
  await requireUser("admin");
  const s = await adminStats();
  const rows = [["Product commission", s.productCommission], ["Booking commission", s.bookingCommission], ["Delivery margin", s.deliveryMargin]] as const;
  return (
    <>
      <PageHeader title="Platform overview" sub="Last 30 days" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Students" value={String(s.users)} hint={`+${s.newUsers} this month`} up={s.newUsers > 0} /><Stat label="Businesses" value={String(s.businesses)} /><Stat label="GMV" value={naira(s.gmv)} hint="Orders + bookings + delivery" /><Stat label="Platform revenue" value={naira(s.revenue)} hint="Commission + delivery margin" up={s.revenue > 0} /></div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="flex flex-col gap-3 p-6"><h3 className="font-bold">Revenue split</h3>{rows.map(([n, v]) => <div key={n} className="flex flex-col gap-1.5 text-sm"><div className="flex justify-between"><span>{n}</span><b>{naira(v)}</b></div><div className="h-2 rounded-pill bg-bg"><div className="h-2 rounded-pill bg-primary" style={{ width: `${s.revenue ? (v / s.revenue) * 100 : 0}%` }} /></div></div>)}</Card>
        <Card className="flex flex-col gap-3 p-6"><h3 className="font-bold">Right now</h3><div className="flex justify-between text-sm"><span>Orders in progress</span><b>{s.activeOrders}</b></div><p className="text-[13px] text-muted">Use the sidebar to review users, businesses, orders, bookings and deliveries.</p></Card>
      </div>
    </>
  );
}
