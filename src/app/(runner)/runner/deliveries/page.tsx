import { PageHeader } from "@/components/layout/Sidebar";
import { Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { listRunnerDeliveries } from "@/server/services/deliveries";

export default async function MyDeliveriesPage() {
  const u = await requireUser("runner");
  const list = await listRunnerDeliveries(u.id);
  return (
    <>
      <PageHeader title="My deliveries" sub={`${list.length} accepted so far`} />
      {!list.length ? <EmptyState icon={<Icon name="box" size={32} />} title="Nothing yet" description="Deliveries you accept show up here." /> : (
        <Card><Table head={["From", "To", "Items", "Pay", "Status", "Date"]}>{list.map((d) => <tr key={d.id}><Td className="font-semibold">{d.businessName}</Td><Td>{d.dropoff}</Td><Td className="text-muted">{d.items}</Td><Td>{naira(d.runnerShare)}</Td><Td><StatusBadge status={d.status} /></Td><Td className="text-muted">{fmtDate(d.createdAt)}</Td></tr>)}</Table></Card>
      )}
    </>
  );
}
