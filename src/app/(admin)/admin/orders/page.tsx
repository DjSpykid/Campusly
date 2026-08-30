import { PageHeader } from "@/components/layout/Sidebar";
import { Card, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { adminOrders } from "@/server/services/admin";

export default async function AdminOrdersPage() {
  await requireUser("admin");
  const orders = await adminOrders();
  return (
    <>
      <PageHeader title="Orders" sub="All paid orders across the campus" />
      <Card><Table head={["Order", "Customer", "Business", "Items", "Total", "Status", "Placed"]}>{orders.map((o) => <tr key={o.id}><Td className="font-semibold">#{o.id.slice(-6).toUpperCase()}</Td><Td>{o.customerName}</Td><Td>{o.businessName}</Td><Td className="text-muted">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</Td><Td>{naira(o.total)}</Td><Td><StatusBadge status={o.status} /></Td><Td className="text-muted">{fmtDate(o.createdAt)}</Td></tr>)}</Table></Card>
    </>
  );
}
