import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/paystack";
import { markOrderPaid } from "@/server/services/orders";
import { markBookingPaid } from "@/server/services/bookings";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!(await verifyWebhookSignature(raw, req.headers.get("x-paystack-signature")))) return NextResponse.json({ ok: false }, { status: 401 });
  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    const ref: string = event.data?.reference ?? "";
    if (ref.startsWith("ord_")) await markOrderPaid(ref);
    else if (ref.startsWith("bk_")) await markBookingPaid(ref);
  }
  return NextResponse.json({ ok: true });
}
