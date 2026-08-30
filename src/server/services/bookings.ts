import { connectDB } from "@/lib/db/mongoose";
import { Booking, Business, Service, Transaction, Review } from "@/server/models";
import { FEES } from "@/config/fees";
import { toBooking } from "./serialize";

const toMins = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const pad = (n: number) => String(n).padStart(2, "0");

export async function getSlots(serviceId: string, date: string) {
  await connectDB();
  const service = await Service.findById(serviceId);
  if (!service) return [];
  const biz = await Business.findById(service.businessId);
  const day = new Date(`${date}T00:00:00`).getDay();
  const hours = (biz?.availability ?? []).filter((h: { day: number }) => h.day === day);
  if (!hours.length) return [];
  const dayStart = new Date(`${date}T00:00:00`), dayEnd = new Date(`${date}T23:59:59`);
  const taken = await Booking.find({ businessId: service.businessId, status: { $ne: "cancelled" }, startAt: { $lt: dayEnd }, endAt: { $gt: dayStart } });
  const now = Date.now();
  const slots: { time: string; startAt: string; available: boolean }[] = [];
  for (const h of hours) {
    for (let m = toMins(h.start); m + service.durationMins <= toMins(h.end); m += service.durationMins) {
      const startAt = new Date(`${date}T${pad(Math.floor(m / 60))}:${pad(m % 60)}:00`);
      const endAt = new Date(startAt.getTime() + service.durationMins * 60000);
      const clash = taken.some((b) => b.startAt < endAt && b.endAt > startAt);
      slots.push({ time: `${pad(Math.floor(m / 60))}:${pad(m % 60)}`, startAt: startAt.toISOString(), available: !clash && startAt.getTime() > now });
    }
  }
  return slots;
}

export async function createBooking(userId: string, serviceId: string, startAtIso: string, note: string, paymentRef: string) {
  await connectDB();
  const service = await Service.findById(serviceId);
  if (!service || !service.active) throw new Error("Service unavailable");
  const startAt = new Date(startAtIso);
  if (Number.isNaN(startAt.getTime()) || startAt.getTime() < Date.now()) throw new Error("Pick a valid time");
  const endAt = new Date(startAt.getTime() + service.durationMins * 60000);
  const clash = await Booking.exists({ businessId: service.businessId, status: { $ne: "cancelled" }, startAt: { $lt: endAt }, endAt: { $gt: startAt } });
  if (clash) throw new Error("That slot was just taken. Pick another");
  const b = await Booking.create({ customerId: userId, businessId: service.businessId, serviceId, serviceName: service.name, startAt, endAt, price: service.price, note, status: "pending_payment", paymentRef });
  return toBooking(b);
}

export async function markBookingPaid(paymentRef: string) {
  await connectDB();
  const b = await Booking.findOne({ paymentRef });
  if (!b) return null;
  if (b.status !== "pending_payment") return toBooking(b);
  b.status = "confirmed";
  await b.save();
  const commission = Math.round(b.price * FEES.bookingCommissionRate);
  await Transaction.updateOne({ refType: "booking", refId: b._id }, { $setOnInsert: { businessId: b.businessId, gross: b.price, commission, net: b.price - commission, paymentRef } }, { upsert: true });
  return toBooking(b);
}

export async function setBookingStatus(bookingId: string, actor: { businessId?: string; customerId?: string }, status: "completed" | "cancelled") {
  await connectDB();
  const filter = actor.businessId ? { _id: bookingId, businessId: actor.businessId } : { _id: bookingId, customerId: actor.customerId };
  const b = await Booking.findOne(filter);
  if (!b || b.status !== "confirmed") throw new Error("Booking cannot be changed");
  if (status === "completed" && !actor.businessId) throw new Error("Only the provider can complete");
  b.status = status;
  await b.save();
}

async function withReviewed(list: ReturnType<typeof toBooking>[]) {
  const reviews = await Review.find({ refType: "booking", refId: { $in: list.map((b) => b.id) } }, "refId");
  return list.map((b) => ({ ...b, reviewed: reviews.some((r) => String(r.refId) === b.id) }));
}
export async function listCustomerBookings(userId: string) {
  await connectDB();
  return withReviewed((await Booking.find({ customerId: userId }).sort({ startAt: -1 }).populate("businessId", "name slug")).map(toBooking));
}
export async function listBusinessBookings(businessId: string) {
  await connectDB();
  return withReviewed((await Booking.find({ businessId, status: { $ne: "pending_payment" } }).sort({ startAt: 1 }).populate("customerId", "name")).map(toBooking));
}
export async function getBookingByRef(paymentRef: string) {
  await connectDB();
  const b = await Booking.findOne({ paymentRef }).populate("businessId", "name slug");
  return b ? toBooking(b) : null;
}
