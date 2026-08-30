import { PageHeader } from "@/components/layout/Sidebar";
import { Card, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { adminBookings } from "@/server/services/admin";

export default async function AdminBookingsPage() {
  await requireUser("admin");
  const list = await adminBookings();
  return (
    <>
      <PageHeader title="Bookings" sub="All paid bookings" />
      <Card><Table head={["Booking", "Customer", "Business", "Service", "When", "Price", "Status"]}>{list.map((b) => <tr key={b.id}><Td className="font-semibold">BK-{b.id.slice(-5).toUpperCase()}</Td><Td>{b.customerName}</Td><Td>{b.businessName}</Td><Td>{b.serviceName}</Td><Td className="text-muted">{fmtDate(b.startAt)}</Td><Td>{naira(b.price)}</Td><Td><StatusBadge status={b.status} /></Td></tr>)}</Table></Card>
    </>
  );
}
