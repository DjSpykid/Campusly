import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: String,
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true, index: true },
    refType: { type: String, enum: ["order", "booking"], required: true },
    refId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, default: "" },
  },
  { timestamps: true },
);
ReviewSchema.index({ refType: 1, refId: 1 }, { unique: true });

export const Review = models.Review ?? model("Review", ReviewSchema);
