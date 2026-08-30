import { Schema, model, models } from "mongoose";

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessId: { type: Schema.Types.ObjectId, ref: "Business" },
    items: [{ productId: { type: Schema.Types.ObjectId, ref: "Product" }, qty: Number, _id: false }],
  },
  { timestamps: true },
);

export const Cart = models.Cart ?? model("Cart", CartSchema);
