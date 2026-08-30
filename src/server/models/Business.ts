import { Schema, model, models } from "mongoose";

const HoursSchema = new Schema({ day: { type: Number, min: 0, max: 6 }, start: String, end: String }, { _id: false });

const BusinessSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    logoUrl: String,
    coverUrl: String,
    type: { type: String, enum: ["products", "services", "both"], required: true },
    category: { type: String, required: true },
    location: { type: String, default: "" },
    contact: { phone: String, whatsapp: String, instagram: String },
    
    availability: { type: [HoursSchema], default: [] },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "suspended"], default: "active" },
  },
  { timestamps: true },
);
BusinessSchema.index({ name: "text", description: "text" });

export const Business = models.Business ?? model("Business", BusinessSchema);
