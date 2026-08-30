import { PageHeader } from "@/components/layout/Sidebar";
import { Card, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { adminDeliveries } from "@/server/services/admin";

export default async function AdminDeliveriesPage() {
  await requireUser("admin");
  const list = await adminDeliveries();
  return (
    <>
      <PageHeader title="Deliveries" sub="Runner assignments and status" />
      <Card><Table head={["From", "To", "Runner", "Fee", "Runner share", "Status", "Requested"]}>{list.map((d) => <tr key={d.id}><Td className="font-semibold">{d.businessName}</Td><Td>{d.dropoff}</Td><Td>{d.runnerName ?? <span className="text-muted">unassigned</span>}</Td><Td>{naira(d.fee)}</Td><Td>{naira(d.runnerShare)}</Td><Td><StatusBadge status={d.status} /></Td><Td className="text-muted">{fmtDate(d.createdAt)}</Td></tr>)}</Table></Card>
    </>
  );
}
