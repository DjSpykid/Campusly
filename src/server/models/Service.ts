import { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    durationMins: { type: Number, required: true, min: 15 },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
ServiceSchema.index({ name: "text", description: "text" });

export const Service = models.Service ?? model("Service", ServiceSchema);
