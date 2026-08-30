import { Schema, model, models } from "mongoose";
import { BOOKING_STATUS } from "@/config/status";

const BookingSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: String,
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    price: { type: Number, required: true },
    note: { type: String, default: "" },
    status: { type: String, enum: BOOKING_STATUS, default: "pending_payment", index: true },
    paymentRef: { type: String, index: true },
  },
  { timestamps: true },
);

export const Booking = models.Booking ?? model("Booking", BookingSchema);
