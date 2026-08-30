import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
);
ProductSchema.index({ name: "text", description: "text" });

export const Product = models.Product ?? model("Product", ProductSchema);
