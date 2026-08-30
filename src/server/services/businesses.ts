import { connectDB } from "@/lib/db/mongoose";
import { Business, Product, Service, Review } from "@/server/models";
import type { BusinessInput } from "@/lib/validation/business";
import { toBusiness, toProduct, toService } from "./serialize";
import { addRole } from "./users";
import type { BusinessDTO, ReviewDTO } from "@/types";

const slugify = (s: string) => s.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);

export async function createBusiness(ownerId: string, input: BusinessInput): Promise<BusinessDTO> {
  await connectDB();
  let slug = slugify(input.name) || "business";
  if (await Business.exists({ slug })) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  const biz = await Business.create({
    ownerId, name: input.name, slug, type: input.type, category: input.category, location: input.location,
    description: input.description, logoUrl: input.logoUrl || undefined, coverUrl: input.coverUrl || undefined,
    contact: { phone: input.phone, whatsapp: input.phone, instagram: input.instagram || undefined },
    availability: input.type === "products" ? [] : [1, 2, 3, 4, 5].map((day) => ({ day, start: "09:00", end: "17:00" })),
  });
  if (input.type !== "services") await addRole(ownerId, "seller");
  if (input.type !== "products") await addRole(ownerId, "provider");
  return toBusiness(biz);
}

export async function updateBusiness(id: string, ownerId: string, input: Partial<BusinessInput> & { availability?: { day: number; start: string; end: string }[] }) {
  await connectDB();
  const set: Record<string, unknown> = {};
  for (const k of ["name", "description", "location", "category"] as const) if (input[k] !== undefined) set[k] = input[k];
  if (input.logoUrl !== undefined) set.logoUrl = input.logoUrl || undefined;
  if (input.coverUrl !== undefined) set.coverUrl = input.coverUrl || undefined;
  if (input.phone) { set["contact.phone"] = input.phone; set["contact.whatsapp"] = input.phone; }
  if (input.instagram !== undefined) set["contact.instagram"] = input.instagram || undefined;
  if (input.availability) set.availability = input.availability;
  await Business.updateOne({ _id: id, ownerId }, { $set: set });
}

export async function getBusinessByOwner(ownerId: string): Promise<BusinessDTO | null> {
  await connectDB();
  const b = await Business.findOne({ ownerId });
  return b ? toBusiness(b) : null;
}

export async function getBusinessBySlug(slug: string) {
  await connectDB();
  const b = await Business.findOne({ slug, status: "active" });
  if (!b) return null;
  const [products, services, reviews] = await Promise.all([
    Product.find({ businessId: b._id }).sort({ createdAt: -1 }),
    Service.find({ businessId: b._id, active: true }).sort({ createdAt: -1 }),
    Review.find({ businessId: b._id }).sort({ createdAt: -1 }).limit(20),
  ]);
  return {
    business: toBusiness(b),
    products: products.map((p) => toProduct(p, b)),
    services: services.map((x) => toService(x, b)),
    reviews: reviews.map((r): ReviewDTO => ({ id: String(r._id), authorName: r.authorName ?? "Student", rating: r.rating, text: r.text ?? "", createdAt: r.createdAt.toISOString() })),
  };
}

export async function discover(q?: string, category?: string) {
  await connectDB();
  const rx = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
  const textFilter = rx ? { $or: [{ name: rx }, { description: rx }] } : {};
  const cat = category && category !== "All" ? { category } : {};
  const [products, services, businesses] = await Promise.all([
    Product.find({ ...textFilter, ...cat, inStock: true }).sort({ createdAt: -1 }).limit(12).populate("businessId", "name slug status"),
    Service.find({ ...textFilter, ...cat, active: true }).sort({ createdAt: -1 }).limit(8).populate("businessId", "name slug status"),
    Business.find({ status: "active", ...(rx ? { $or: [{ name: rx }, { description: rx }, { category: rx }] } : {}), ...(category && category !== "All" ? { category } : {}) })
      .sort({ ratingAvg: -1, ratingCount: -1 }).limit(6),
  ]);
  return {
    products: products.filter((p) => p.businessId?.status === "active").map((p) => toProduct(p)),
    services: services.filter((x) => x.businessId?.status === "active").map((x) => toService(x)),
    businesses: businesses.map(toBusiness),
  };
}
