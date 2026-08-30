import { requireUser } from "@/lib/auth/session";
import { listCustomerBookings } from "@/server/services/bookings";
import { Avatar, Button, ButtonLink, Card, EmptyState, Icon, StatusBadge } from "@/components/ui";
import { Timeline, fmtDate } from "@/components/features/Stat";
import { naira } from "@/lib/utils";
import { ReviewForm } from "../ReviewForm";
import { cancelBookingAction } from "../actions";

const stepOf: Record<string, number> = { confirmed: 1, completed: 2 };

export default async function BookingsPage() {
  const u = await requireUser();
  const bookings = (await listCustomerBookings(u.id)).filter((b) => b.status !== "pending_payment");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-bold">My bookings</h1>
      {!bookings.length ? <EmptyState icon={<Icon name="calendar" size={32} />} title="No bookings yet" description="Book hair, nails, tutoring, repairs and more." action={<ButtonLink href="/discover" size="sm">Find a service</ButtonLink>} /> : null}
      {bookings.map((b) => (
        <Card key={b.id} className="flex flex-col gap-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3"><Avatar name={b.businessName ?? "?"} /><div><div className="font-bold">{b.serviceName} · {b.businessName}</div><div className="text-[13px] text-muted">{fmtDate(b.startAt)} · {naira(b.price)}</div></div></div>
            <StatusBadge status={b.status} />
          </div>
          {b.status !== "cancelled" ? <Timeline steps={["Paid", "Confirmed", "Completed", "Reviewed"]} current={b.reviewed ? 3 : stepOf[b.status] ?? 0} /> : null}
          {b.status === "confirmed" ? <form action={cancelBookingAction}><input type="hidden" name="bookingId" value={b.id} /><Button type="submit" variant="danger" size="sm">Cancel booking</Button></form> : null}
          {b.status === "completed" && !b.reviewed ? <ReviewForm refType="booking" refId={b.id} /> : null}
        </Card>
      ))}
    </div>
  );
}
