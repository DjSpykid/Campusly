import { connectDB } from "@/lib/db/mongoose";
import { User, Business, Order, Booking, Delivery, Transaction } from "@/server/models";
import { toBusiness, toOrder, toBooking, toDelivery } from "./serialize";

export async function adminStats() {
  await connectDB();
  const monthAgo = new Date(Date.now() - 30 * 864e5);
  const [users, businesses, newUsers, txs, activeOrders] = await Promise.all([
    User.countDocuments(), Business.countDocuments(), User.countDocuments({ createdAt: { $gte: monthAgo } }),
    Transaction.find({ createdAt: { $gte: monthAgo } }), Order.countDocuments({ status: { $in: ["paid", "ready", "out_for_delivery"] } }),
  ]);
  const gmv = txs.reduce((s, t) => s + t.gross + (t.deliveryFee ?? 0), 0);
  const productCommission = txs.filter((t) => t.refType === "order").reduce((s, t) => s + t.commission, 0);
  const bookingCommission = txs.filter((t) => t.refType === "booking").reduce((s, t) => s + t.commission, 0);
  const deliveryMargin = txs.reduce((s, t) => s + (t.platformMargin ?? 0), 0);
  return { users, businesses, newUsers, gmv, revenue: productCommission + bookingCommission + deliveryMargin, productCommission, bookingCommission, deliveryMargin, activeOrders };
}
export async function adminUsers() {
  await connectDB();
  return (await User.find().sort({ createdAt: -1 }).limit(200)).map((u) => ({ id: String(u._id), name: u.name, email: u.email, roles: Array.from(u.roles) as string[], campus: u.campus ?? "", createdAt: u.createdAt.toISOString() }));
}
export async function adminBusinesses() {
  await connectDB();
  const list = await Business.find().sort({ createdAt: -1 }).populate("ownerId", "name");
  const counts = await Order.aggregate([{ $match: { status: { $ne: "pending_payment" } } }, { $group: { _id: "$businessId", n: { $sum: 1 } } }]);
  return list.map((b) => ({ ...toBusiness(b), ownerName: (b.ownerId as { name?: string })?.name ?? "", orders: counts.find((c) => String(c._id) === String(b._id))?.n ?? 0 }));
}
export async function setBusinessStatus(id: string, status: "active" | "suspended") {
  await connectDB();
  await Business.updateOne({ _id: id }, { $set: { status } });
}
export async function adminOrders() {
  await connectDB();
  return (await Order.find({ status: { $ne: "pending_payment" } }).sort({ createdAt: -1 }).limit(200).populate("businessId", "name").populate("customerId", "name")).map(toOrder);
}
export async function adminBookings() {
  await connectDB();
  return (await Booking.find({ status: { $ne: "pending_payment" } }).sort({ startAt: -1 }).limit(200).populate("businessId", "name").populate("customerId", "name")).map(toBooking);
}
export async function adminDeliveries() {
  await connectDB();
  return (await Delivery.find().sort({ createdAt: -1 }).limit(200).populate("businessId", "name").populate("runnerId", "name").populate("orderId", "items")).map(toDelivery);
}
