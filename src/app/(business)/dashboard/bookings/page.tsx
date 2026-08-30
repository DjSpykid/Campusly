import { PageHeader } from "@/components/layout/Sidebar";
import { Button, Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Table, Td, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { requireBusiness } from "../../business";
import { listBusinessBookings } from "@/server/services/bookings";
import { bookingStatusAction } from "../../actions";

export default async function BookingsPage() {
  const { business } = await requireBusiness();
  const bookings = await listBusinessBookings(business.id);
  return (
    <>
      <PageHeader title="Bookings" sub="Complete or cancel appointments. Customers pay before booking." />
      {!bookings.length ? <EmptyState icon={<Icon name="calendar" size={32} />} title="No bookings yet" description="Set your opening hours in Settings so students can book." /> : (
        <Card><Table head={["Booking", "Customer", "Service", "When", "Price", "Status", "Action"]}>{bookings.map((b) => (
          <tr key={b.id}>
            <Td className="font-semibold">BK-{b.id.slice(-5).toUpperCase()}</Td><Td>{b.customerName}</Td><Td>{b.serviceName}{b.note ? <div className="text-xs text-muted">Note: {b.note}</div> : null}</Td>
            <Td className="text-muted">{fmtDate(b.startAt)}</Td><Td>{naira(b.price)}</Td><Td><StatusBadge status={b.status} /></Td>
            <Td>{b.status === "confirmed" ? <div className="flex gap-2"><form action={bookingStatusAction}><input type="hidden" name="bookingId" value={b.id} /><input type="hidden" name="status" value="completed" /><Button type="submit" size="sm">Mark completed</Button></form><form action={bookingStatusAction}><input type="hidden" name="bookingId" value={b.id} /><input type="hidden" name="status" value="cancelled" /><Button type="submit" size="sm" variant="outline">Cancel</Button></form></div> : <span className="text-muted">-</span>}</Td>
          </tr>
        ))}</Table></Card>
      )}
    </>
  );
}
