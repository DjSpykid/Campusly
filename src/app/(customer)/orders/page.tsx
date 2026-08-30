import { requireUser } from "@/lib/auth/session";
import { listCustomerOrders } from "@/server/services/orders";
import { Avatar, ButtonLink, Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Timeline, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { ReviewForm } from "../ReviewForm";

const STEPS = ["Paid", "Being prepared", "Ready", "On the way", "Delivered"];
const PICKUP_STEPS = ["Paid", "Being prepared", "Ready for pickup", "Collected"];
const stepOf: Record<string, number> = { paid: 1, ready: 2, out_for_delivery: 3, delivered: 4 };

export default async function OrdersPage() {
  const u = await requireUser();
  const orders = (await listCustomerOrders(u.id)).filter((o) => o.status !== "pending_payment");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold">My orders</h1>
      {!orders.length ? <EmptyState icon={<Icon name="box" size={32} />} title="No orders yet" description="Anything you buy shows up here with live status." action={<ButtonLink href="/discover" size="sm">Browse products</ButtonLink>} /> : null}
      {orders.map((o) => (
        <Card key={o.id} className="flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3"><Avatar name={o.businessName ?? "?"} /><div><div className="font-bold">Order #{o.id.slice(-6).toUpperCase()} · {o.businessName}</div><div className="text-[13px] text-muted">{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")} · {naira(o.total)} · {fmtDate(o.createdAt)}</div></div></div>
            <StatusBadge status={o.status} />
          </div>
          {o.status !== "cancelled" ? <Timeline steps={o.deliveryRequired ? STEPS : PICKUP_STEPS} current={o.deliveryRequired ? stepOf[o.status] ?? 0 : Math.min(stepOf[o.status] ?? 0, 3)} /> : null}
          {o.delivery?.runnerName && o.status !== "delivered" ? (
            <div className="flex items-center gap-3 rounded-md bg-bg px-4 py-3.5 text-sm"><Avatar name={o.delivery.runnerName} accent /><div><div className="font-semibold">{o.delivery.runnerName} is your runner</div><div className="text-xs text-muted">{o.delivery.status.replace(/_/g, " ")} · {o.deliveryAddress}</div></div></div>
          ) : o.deliveryRequired && o.status === "ready" ? <p className="text-sm text-muted">Waiting for a runner to accept your delivery.</p> : null}
          {o.status === "delivered" && !o.reviewed ? <ReviewForm refType="order" refId={o.id} /> : null}
        </Card>
      ))}
    </div>
  );
}
