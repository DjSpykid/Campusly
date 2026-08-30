import { Schema, model, models } from "mongoose";
import { DELIVERY_STATUS } from "@/config/status";

const DeliverySchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    runnerId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    pickup: String,
    dropoff: String,
    fee: { type: Number, required: true },
    runnerShare: { type: Number, required: true },
    status: { type: String, enum: DELIVERY_STATUS, default: "requested", index: true },
  },
  { timestamps: true },
);

export const Delivery = models.Delivery ?? model("Delivery", DeliverySchema);
