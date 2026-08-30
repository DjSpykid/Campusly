import { connectDB } from "@/lib/db/mongoose";
import { Transaction, Order, Booking } from "@/server/models";
import type { TransactionDTO } from "@/types";

export async function businessEarnings(businessId: string) {
  await connectDB();
  const txs = await Transaction.find({ businessId }).sort({ createdAt: -1 });
  const weekAgo = Date.now() - 7 * 864e5;
  const gross = txs.reduce((s, t) => s + t.gross, 0), commission = txs.reduce((s, t) => s + t.commission, 0);
  const week = txs.filter((t) => t.createdAt.getTime() >= weekAgo).reduce((s, t) => s + t.net, 0);
  const [orders, bookings] = await Promise.all([
    Order.find({ _id: { $in: txs.filter((t) => t.refType === "order").map((t) => t.refId) } }, "customerId").populate("customerId", "name"),
    Booking.find({ _id: { $in: txs.filter((t) => t.refType === "booking").map((t) => t.refId) } }, "customerId").populate("customerId", "name"),
  ]);
  const nameOf = (t: { refType: string; refId: unknown }) => {
    const list = t.refType === "order" ? orders : bookings;
    return list.find((x) => String(x._id) === String(t.refId))?.customerId?.name;
  };
  const transactions: TransactionDTO[] = txs.map((t) => ({ id: String(t._id), refType: t.refType, refId: String(t.refId), gross: t.gross, commission: t.commission, net: t.net, createdAt: t.createdAt.toISOString(), customerName: nameOf(t) }));
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d; });
  const daily = days.map((d) => ({ date: d.toISOString().slice(0, 10), net: txs.filter((t) => t.createdAt >= d && t.createdAt < new Date(d.getTime() + 864e5)).reduce((s, t) => s + t.net, 0) }));
  return { gross, commission, net: gross - commission, week, count: txs.length, transactions, daily };
}
