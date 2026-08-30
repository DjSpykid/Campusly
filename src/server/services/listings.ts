import { connectDB } from "@/lib/db/mongoose";
import { Product, Service, Business } from "@/server/models";
import type { ProductInput, ServiceInput } from "@/lib/validation/business";
import { toProduct, toService } from "./serialize";

const productDoc = (i: ProductInput) => ({ name: i.name, description: i.description, price: i.price, category: i.category, inStock: i.inStock, images: i.images });
const serviceDoc = (i: ServiceInput) => ({ name: i.name, description: i.description, price: i.price, durationMins: i.durationMins, category: i.category, active: i.active, images: i.images });

export async function listProducts(businessId: string) {
  await connectDB();
  return (await Product.find({ businessId }).sort({ createdAt: -1 })).map((p) => toProduct(p));
}
export async function listServices(businessId: string) {
  await connectDB();
  return (await Service.find({ businessId }).sort({ createdAt: -1 })).map((x) => toService(x));
}
export async function getProduct(id: string) {
  await connectDB();
  const p = await Product.findById(id).populate("businessId", "name slug status location ratingAvg ratingCount");
  return p && p.businessId?.status === "active" ? { product: toProduct(p), business: p.businessId } : null;
}
export async function getService(id: string) {
  await connectDB();
  const x = await Service.findById(id).populate("businessId");
  return x && x.businessId?.status === "active" ? { service: toService(x), business: x.businessId } : null;
}
export async function createProduct(businessId: string, input: ProductInput) {
  await connectDB();
  await Product.create({ businessId, ...productDoc(input) });
}
export async function updateProduct(id: string, businessId: string, input: ProductInput) {
  await connectDB();
  await Product.updateOne({ _id: id, businessId }, { $set: productDoc(input) });
}
export async function deleteProduct(id: string, businessId: string) {
  await connectDB();
  await Product.deleteOne({ _id: id, businessId });
}
export async function createService(businessId: string, input: ServiceInput) {
  await connectDB();
  await Service.create({ businessId, ...serviceDoc(input) });
}
export async function updateService(id: string, businessId: string, input: ServiceInput) {
  await connectDB();
  await Service.updateOne({ _id: id, businessId }, { $set: serviceDoc(input) });
}
export async function deleteService(id: string, businessId: string) {
  await connectDB();
  await Service.deleteOne({ _id: id, businessId });
}
export async function businessExists(id: string) {
  await connectDB();
  return !!(await Business.exists({ _id: id }));
}
