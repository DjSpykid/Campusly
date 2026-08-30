import { verifyPayment } from "@/lib/payments/paystack";
import { markOrderPaid, getOrderByRef } from "@/server/services/orders";
import { markBookingPaid, getBookingByRef } from "@/server/services/bookings";
import { ButtonLink, Card, Icon } from "@/components/ui";
import { naira } from "@/lib/utils";
import { fmtDate } from "@/components/features/Stat";

export default async function PayCallbackPage({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) {
  const sp = await searchParams;
  const reference = sp.reference ?? sp.trxref ?? "";
  const isOrder = reference.startsWith("ord_");
  const { success } = reference ? await verifyPayment(reference) : { success: false };
  if (success) { if (isOrder) await markOrderPaid(reference); else await markBookingPaid(reference); }
  const order = isOrder ? await getOrderByRef(reference) : null;
  const booking = !isOrder ? await getBookingByRef(reference) : null;
  const paid = success && ((order && order.status !== "pending_payment") || (booking && booking.status !== "pending_payment"));
  return (
    <div className="mx-auto max-w-[560px]">
      <Card className="flex flex-col items-center gap-4 p-10 text-center">
        <div className={`flex size-[72px] items-center justify-center rounded-pill ${paid ? "bg-green-100" : "bg-red-100"}`}><Icon name={paid ? "check" : "bell"} size={36} className={paid ? "text-green-700" : "text-danger"} /></div>
        <h1 className="text-[30px] font-bold">{paid ? "Payment successful" : "Payment not completed"}</h1>
        <p className="max-w-[380px] text-muted text-pretty">{paid ? (order ? `${order.businessName} has your order. Track every step here. No need to chase anyone on WhatsApp.` : `Your booking with ${booking?.businessName} is confirmed.`) : "We couldn't confirm this payment. If you were charged, it will be confirmed automatically shortly."}</p>
        {paid && (order || booking) ? (
          <div className="flex w-full flex-col gap-2 rounded-lg bg-bg p-5 text-left text-sm">
            {order ? <>
              <Row k="Order" v={`#${order.id.slice(-6).toUpperCase()}`} /><Row k="Paid" v={`${naira(order.total)} · Paystack`} />
              <Row k={order.deliveryRequired ? "Deliver to" : "Pick up"} v={order.deliveryRequired ? order.deliveryAddress : "From the seller"} />
            </> : booking ? <>
              <Row k="Service" v={booking.serviceName} /><Row k="When" v={fmtDate(booking.startAt)} /><Row k="Paid" v={`${naira(booking.price)} · Paystack`} />
            </> : null}
          </div>
        ) : null}
        <div className="flex w-full gap-3">
          <ButtonLink href={order ? "/orders" : "/bookings"} size="lg" className="flex-1">{order ? "Track order" : "My bookings"}</ButtonLink>
          <ButtonLink href="/discover" variant="outline" size="lg" className="flex-1">Keep browsing</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
const Row = ({ k, v }: { k: string; v: string }) => <div className="flex justify-between"><span className="text-muted">{k}</span><b>{v}</b></div>;
