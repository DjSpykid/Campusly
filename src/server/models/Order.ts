import { Schema, model, models } from "mongoose";
import { ORDER_STATUS } from "@/config/status";

const OrderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    items: [{ productId: Schema.Types.ObjectId, name: String, qty: Number, unitPrice: Number, _id: false }],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryRequired: { type: Boolean, default: false },
    deliveryAddress: { type: String, default: "" },
    note: { type: String, default: "" },
    status: { type: String, enum: ORDER_STATUS, default: "pending_payment", index: true },
    paymentRef: { type: String, index: true },
  },
  { timestamps: true },
);

export const Order = models.Order ?? model("Order", OrderSchema);
