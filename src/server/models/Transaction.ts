import { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    refType: { type: String, enum: ["order", "booking"], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    gross: { type: Number, required: true },
    commission: { type: Number, required: true },
    net: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    runnerShare: { type: Number, default: 0 },
    platformMargin: { type: Number, default: 0 },
    paymentRef: String,
  },
  { timestamps: true },
);
TransactionSchema.index({ refType: 1, refId: 1 }, { unique: true });

export const Transaction = models.Transaction ?? model("Transaction", TransactionSchema);
