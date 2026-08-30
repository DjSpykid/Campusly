import { connectDB } from "@/lib/db/mongoose";
import { Delivery, Order } from "@/server/models";
import { toDelivery } from "./serialize";

const populate = (q: ReturnType<typeof Delivery.find>) => q.populate("businessId", "name location").populate("runnerId", "name").populate("orderId", "items");

export async function listOpenDeliveries() {
  await connectDB();
  return (await populate(Delivery.find({ status: "requested" }).sort({ createdAt: 1 }))).map(toDelivery);
}
export async function listRunnerDeliveries(runnerId: string) {
  await connectDB();
  return (await populate(Delivery.find({ runnerId }).sort({ createdAt: -1 }))).map(toDelivery);
}
export async function acceptDelivery(deliveryId: string, runnerId: string) {
  await connectDB();
  const res = await Delivery.updateOne({ _id: deliveryId, status: "requested" }, { $set: { runnerId, status: "accepted" } });
  if (!res.modifiedCount) throw new Error("Already taken");
}
export async function advanceDelivery(deliveryId: string, runnerId: string) {
  await connectDB();
  const d = await Delivery.findOne({ _id: deliveryId, runnerId });
  if (!d) throw new Error("Not your delivery");
  const next: Record<string, string> = { accepted: "picked_up", picked_up: "delivered" };
  const status = next[d.status];
  if (!status) throw new Error("Nothing to advance");
  d.status = status;
  await d.save();
  await Order.updateOne({ _id: d.orderId }, { $set: { status: status === "picked_up" ? "out_for_delivery" : "delivered" } });
}
export async function runnerEarnings(runnerId: string) {
  await connectDB();
  const done = await Delivery.find({ runnerId, status: "delivered" });
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const weekAgo = new Date(Date.now() - 7 * 864e5);
  const sum = (xs: typeof done) => xs.reduce((s, d) => s + d.runnerShare, 0);
  return { total: sum(done), today: sum(done.filter((d) => d.updatedAt >= startOfDay)), week: sum(done.filter((d) => d.updatedAt >= weekAgo)), count: done.length };
}
