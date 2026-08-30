import { PageHeader } from "@/components/layout/Sidebar";
import { Button, Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Stat } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { FEES } from "@/config/fees";
import { requireUser } from "@/lib/auth/session";
import { listOpenDeliveries, listRunnerDeliveries, runnerEarnings } from "@/server/services/deliveries";
import { acceptDeliveryAction, advanceDeliveryAction } from "../actions";

export default async function RunnerPage() {
  const u = await requireUser("runner");
  const [open, mine, e] = await Promise.all([listOpenDeliveries(), listRunnerDeliveries(u.id), runnerEarnings(u.id)]);
  const active = mine.filter((d) => d.status === "accepted" || d.status === "picked_up");
  return (
    <>
      <PageHeader title="Deliveries near you" sub={`Buyers pay ${naira(FEES.deliveryFee)} per delivery. You keep ${naira(Math.round(FEES.deliveryFee * FEES.runnerShareRate))} (${FEES.runnerShareRate * 100}%).`} />
      <div className="grid gap-5 sm:grid-cols-3"><Stat label="Earned today" value={naira(e.today)} up={e.today > 0} /><Stat label="This week" value={naira(e.week)} hint={`${e.count} deliveries total`} /><Stat label="All time" value={naira(e.total)} /></div>
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_420px]">
        <div className="flex flex-col gap-3">
          <h3 className="font-bold">Open requests · {open.length}</h3>
          {!open.length ? <EmptyState icon={<Icon name="truck" size={32} />} title="No open requests right now" description="Sellers request a runner when an order is ready. Check back soon." /> : open.map((d) => (
            <Card key={d.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex size-11 items-center justify-center rounded-md bg-accent"><Icon name="truck" size={22} /></div>
              <div className="flex-1"><div className="font-semibold">{d.businessName} → {d.dropoff}</div><div className="text-[13px] text-muted">Pick up at {d.pickup}{d.items ? ` · ${d.items}` : ""}</div></div>
              <div className="text-right"><div className="font-display text-lg font-extrabold">{naira(d.runnerShare)}</div><div className="text-xs text-muted">you earn</div></div>
              <form action={acceptDeliveryAction}><input type="hidden" name="id" value={d.id} /><Button type="submit" size="sm">Accept</Button></form>
            </Card>
          ))}
        </div>
        <Card className="flex flex-col gap-4 p-6">
          <h3 className="font-bold">Active deliveries</h3>
          {!active.length ? <p className="text-sm text-muted">Accept a request to start.</p> : active.map((d) => (
            <div key={d.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold">{d.businessName}</span><StatusBadge status={d.status} /></div>
              <div className="flex gap-3 text-sm"><div className={`flex size-6 shrink-0 items-center justify-center rounded-pill ${d.status === "picked_up" ? "bg-green-100 text-green-700" : "bg-primary-light text-primary"}`}><Icon name={d.status === "picked_up" ? "check" : "pin"} size={14} /></div><div><div className="text-xs text-muted">Pick up</div><div className="font-semibold">{d.pickup}</div></div></div>
              <div className="flex gap-3 text-sm"><div className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-primary-light text-primary"><Icon name="pin" size={14} /></div><div><div className="text-xs text-muted">Drop off</div><div className="font-semibold">{d.dropoff}</div></div></div>
              <form action={advanceDeliveryAction}><input type="hidden" name="id" value={d.id} /><Button type="submit" className="w-full"><Icon name="check" size={18} />{d.status === "accepted" ? "Picked up" : "Mark as delivered"}</Button></form>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
