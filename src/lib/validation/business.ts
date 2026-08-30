import { z } from "zod";
import { PRODUCT_CATEGORIES, SERVICE_CATEGORIES } from "@/config/categories";

export const businessSchema = z.object({
  name: z.string().trim().min(2, "Enter a business name").max(60),
  type: z.enum(["products", "services", "both"]),
  category: z.string().trim().min(1, "Pick a category"),
  location: z.string().trim().min(2, "Where are you based?"),
  description: z.string().trim().max(600).default(""),
  phone: z.string().trim().min(7, "Enter a WhatsApp number"),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  coverUrl: z.string().trim().optional().or(z.literal("")),
});
export type BusinessInput = z.infer<typeof businessSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name").max(80),
  description: z.string().trim().max(600).default(""),
  price: z.coerce.number().int("Whole naira only").min(50, "Price is too low"),
  category: z.enum(PRODUCT_CATEGORIES),
  images: z.array(z.string().trim().min(1)).max(4).default([]),
  inStock: z.coerce.boolean().default(true),
});
export type ProductInput = z.infer<typeof productSchema>;

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Enter a service name").max(80),
  description: z.string().trim().max(600).default(""),
  price: z.coerce.number().int("Whole naira only").min(50, "Price is too low"),
  durationMins: z.coerce.number().int().min(15, "At least 15 minutes").max(24 * 60),
  category: z.enum(SERVICE_CATEGORIES),
  images: z.array(z.string().trim().min(1)).max(4).default([]),
  active: z.coerce.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM");
export const availabilitySchema = z.array(z.object({ day: z.number().int().min(0).max(6), start: hhmm, end: hhmm }));

export const runnerSchema = z.object({
  phone: z.string().trim().min(7, "Enter your phone number"),
  location: z.string().trim().min(2, "Where do you stay?"),
});
