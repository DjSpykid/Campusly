import { connectDB } from "@/lib/db/mongoose";
import { Review, Order, Booking, Business } from "@/server/models";

export async function createReview(author: { id: string; name: string }, refType: "order" | "booking", refId: string, rating: number, text: string) {
  await connectDB();
  const ref = refType === "order" ? await Order.findOne({ _id: refId, customerId: author.id, status: "delivered" }) : await Booking.findOne({ _id: refId, customerId: author.id, status: "completed" });
  if (!ref) throw new Error("You can only review completed orders and bookings");
  if (await Review.exists({ refType, refId })) throw new Error("Already reviewed");
  await Review.create({ authorId: author.id, authorName: author.name, businessId: ref.businessId, refType, refId, rating, text });
  const agg = await Review.aggregate([{ $match: { businessId: ref.businessId } }, { $group: { _id: null, avg: { $avg: "$rating" }, n: { $sum: 1 } } }]);
  await Business.updateOne({ _id: ref.businessId }, { $set: { ratingAvg: Math.round((agg[0]?.avg ?? 0) * 10) / 10, ratingCount: agg[0]?.n ?? 0 } });
}
