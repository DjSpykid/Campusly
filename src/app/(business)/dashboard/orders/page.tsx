import { PageHeader } from "@/components/layout/Sidebar";
import { Button, Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireBusiness } from "../../business";
import { listBusinessOrders } from "@/server/services/orders";
import { orderStatusAction } from "../../actions";

function NextAction({ o }: { o: { id: string; status: string; deliveryRequired: boolean; delivery?: { status: string } | null } }) {
  const btn = (status: string, label: string, variant: "primary" | "secondary" | "outline" = "secondary") => (
    <form action={orderStatusAction}><input type="hidden" name="orderId" value={o.id} /><input type="hidden" name="status" value={status} /><Button type="submit" size="sm" variant={variant}>{label}</Button></form>
  );
  if (o.status === "paid") return <div className="flex gap-2">{btn("ready", "Mark ready", "primary")}{btn("cancelled", "Cancel", "outline")}</div>;
  if (o.status === "ready" && o.deliveryRequired) return o.delivery ? <span className="text-xs text-muted">Waiting for a runner…</span> : btn("request_delivery", "Request runner", "primary");
  if (o.status === "ready") return btn("delivered", "Mark collected", "primary");
  return <span className="text-muted">-</span>;
}

export default async function OrdersPage() {
  const { business } = await requireBusiness();
  const orders = await listBusinessOrders(business.id);
  return (
    <>
      <PageHeader title="Orders" sub="Confirm, prepare, and hand off to a runner." />
      {!orders.length ? <EmptyState icon={<Icon name="cart" size={32} />} title="No orders yet" description="When students buy from you, orders show up here." /> : (
        <Card><Table head={["Order", "Customer", "Items", "Deliver to", "Total", "Placed", "Status", "Action"]}>{orders.map((o) => (
          <tr key={o.id}>
            <Td className="font-semibold">#{o.id.slice(-6).toUpperCase()}</Td><Td>{o.customerName}</Td>
            <Td className="text-muted">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}{o.note ? <div className="text-xs">Note: {o.note}</div> : null}</Td>
            <Td>{o.deliveryRequired ? o.deliveryAddress : "Pick up"}{o.delivery?.runnerName ? <div className="text-xs text-muted">Runner: {o.delivery.runnerName}</div> : null}</Td>
            <Td>{naira(o.total)}</Td><Td className="text-muted">{fmtDate(o.createdAt)}</Td><Td><StatusBadge status={o.status} /></Td><Td><NextAction o={o} /></Td>
          </tr>
        ))}</Table></Card>
      )}
    </>
  );
}
