import { connectDB } from "@/lib/db/mongoose";
import { Order, Business, Delivery, Transaction, Review, Product } from "@/server/models";
import { FEES } from "@/config/fees";
import { getCart, clearCart } from "./cart";
import { toOrder, toDelivery } from "./serialize";
import type { OrderDTO } from "@/types";

export async function createOrderFromCart(userId: string, opts: { deliveryRequired: boolean; deliveryAddress: string; note: string; paymentRef: string }) {
  await connectDB();
  const cart = await getCart(userId);
  if (!cart.businessId || cart.items.length === 0) throw new Error("Your cart is empty");
  if (cart.items.some((i) => !i.inStock)) throw new Error("Some items are out of stock");
  const deliveryFee = opts.deliveryRequired ? FEES.deliveryFee : 0;
  const order = await Order.create({
    customerId: userId, businessId: cart.businessId,
    items: cart.items.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, unitPrice: i.unitPrice })),
    subtotal: cart.subtotal, deliveryFee, total: cart.subtotal + deliveryFee,
    deliveryRequired: opts.deliveryRequired, deliveryAddress: opts.deliveryAddress, note: opts.note,
    status: "pending_payment", paymentRef: opts.paymentRef,
  });
  return toOrder(order);
}

export async function markOrderPaid(paymentRef: string) {
  await connectDB();
  const order = await Order.findOne({ paymentRef });
  if (!order) return null;
  if (order.status !== "pending_payment") return toOrder(order);
  order.status = "paid";
  await order.save();
  const commission = Math.round(order.subtotal * FEES.productCommissionRate);
  const runnerShare = order.deliveryRequired ? Math.round(order.deliveryFee * FEES.runnerShareRate) : 0;
  await Transaction.updateOne(
    { refType: "order", refId: order._id },
    { $setOnInsert: { businessId: order.businessId, gross: order.subtotal, commission, net: order.subtotal - commission, deliveryFee: order.deliveryFee, runnerShare, platformMargin: order.deliveryFee - runnerShare, paymentRef } },
    { upsert: true },
  );
  await clearCart(String(order.customerId));
  return toOrder(order);
}

const NEXT: Record<string, string[]> = { paid: ["ready", "cancelled"], ready: ["out_for_delivery", "delivered"], out_for_delivery: ["delivered"] };

export async function setOrderStatus(orderId: string, businessId: string, status: string) {
  await connectDB();
  const order = await Order.findOne({ _id: orderId, businessId });
  if (!order || !NEXT[order.status]?.includes(status)) throw new Error("Invalid status change");
  if (status === "delivered" && order.deliveryRequired) throw new Error("Runner completes delivery orders");
  order.status = status;
  await order.save();
}

export async function requestDelivery(orderId: string, businessId: string) {
  await connectDB();
  const [order, biz] = await Promise.all([Order.findOne({ _id: orderId, businessId }), Business.findById(businessId)]);
  if (!order || !biz || order.status !== "ready" || !order.deliveryRequired) throw new Error("Order is not ready for delivery");
  await Delivery.updateOne(
    { orderId: order._id },
    { $setOnInsert: { businessId, pickup: biz.location || biz.name, dropoff: order.deliveryAddress, fee: order.deliveryFee, runnerShare: Math.round(order.deliveryFee * FEES.runnerShareRate), status: "requested" } },
    { upsert: true },
  );
}

async function attach(orders: OrderDTO[]) {
  const ids = orders.map((o) => o.id);
  const [deliveries, reviews] = await Promise.all([
    Delivery.find({ orderId: { $in: ids } }).populate("runnerId", "name"),
    Review.find({ refType: "order", refId: { $in: ids } }, "refId"),
  ]);
  return orders.map((o) => ({
    ...o,
    delivery: (() => { const d = deliveries.find((x) => String(x.orderId) === o.id); return d ? toDelivery(d) : null; })(),
    reviewed: reviews.some((r) => String(r.refId) === o.id),
  }));
}

export async function listCustomerOrders(userId: string) {
  await connectDB();
  const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 }).populate("businessId", "name slug");
  return attach(orders.map(toOrder));
}
export async function listBusinessOrders(businessId: string) {
  await connectDB();
  const orders = await Order.find({ businessId, status: { $ne: "pending_payment" } }).sort({ createdAt: -1 }).populate("customerId", "name");
  return attach(orders.map(toOrder));
}
export async function getOrderForCustomer(orderId: string, userId: string) {
  await connectDB();
  const o = await Order.findOne({ _id: orderId, customerId: userId }).populate("businessId", "name slug");
  return o ? (await attach([toOrder(o)]))[0] : null;
}
export async function getOrderByRef(paymentRef: string) {
  await connectDB();
  const o = await Order.findOne({ paymentRef }).populate("businessId", "name slug");
  return o ? toOrder(o) : null;
}
export async function productsSoldSummary(businessId: string) {
  await connectDB();
  const rows = await Order.aggregate([
    { $match: { businessId: (await Product.db.base.Types.ObjectId.createFromHexString(businessId)), status: { $in: ["paid", "ready", "out_for_delivery", "delivered"] } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.name", qty: { $sum: "$items.qty" }, revenue: { $sum: { $multiply: ["$items.qty", "$items.unitPrice"] } } } },
    { $sort: { revenue: -1 } }, { $limit: 5 },
  ]);
  return rows.map((r) => ({ name: r._id as string, qty: r.qty as number, revenue: r.revenue as number }));
}
