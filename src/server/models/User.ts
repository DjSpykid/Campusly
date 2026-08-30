import { Schema, model, models, type InferSchemaType } from "mongoose";
import { ROLES } from "@/config/roles";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    campus: { type: String, trim: true },
    roles: { type: [String], enum: ROLES, default: ["customer"] },
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };
export const User = models.User ?? model("User", UserSchema);
