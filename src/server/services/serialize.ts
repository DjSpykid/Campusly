import type { BusinessDTO, ProductDTO, ServiceDTO, OrderDTO, BookingDTO, DeliveryDTO } from "@/types";

type Doc = any;
const s = (v: unknown) => (v == null ? undefined : String(v));
const d = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v ?? ""));

export const toBusiness = (b: Doc): BusinessDTO => ({
  id: String(b._id), ownerId: String(b.ownerId), name: b.name, slug: b.slug, description: b.description ?? "",
  logoUrl: b.logoUrl || undefined, coverUrl: b.coverUrl || undefined, type: b.type, category: b.category, location: b.location ?? "",
  contact: { phone: b.contact?.phone, whatsapp: b.contact?.whatsapp, instagram: b.contact?.instagram },
  availability: (b.availability ?? []).map((h: Doc) => ({ day: h.day, start: h.start, end: h.end })),
  ratingAvg: b.ratingAvg ?? 0, ratingCount: b.ratingCount ?? 0, status: b.status,
});
export const toProduct = (p: Doc, biz?: Doc): ProductDTO => ({
  id: String(p._id), businessId: String(p.businessId?._id ?? p.businessId), name: p.name, description: p.description ?? "", price: p.price,
  images: p.images ?? [], category: p.category, inStock: p.inStock,
  businessName: biz?.name ?? p.businessId?.name, businessSlug: biz?.slug ?? p.businessId?.slug,
});
export const toService = (x: Doc, biz?: Doc): ServiceDTO => ({
  id: String(x._id), businessId: String(x.businessId?._id ?? x.businessId), name: x.name, description: x.description ?? "", price: x.price,
  durationMins: x.durationMins, images: x.images ?? [], category: x.category, active: x.active,
  businessName: biz?.name ?? x.businessId?.name, businessSlug: biz?.slug ?? x.businessId?.slug,
});
export const toOrder = (o: Doc): OrderDTO => ({
  id: String(o._id), customerId: String(o.customerId?._id ?? o.customerId), businessId: String(o.businessId?._id ?? o.businessId),
  businessName: o.businessId?.name, customerName: o.customerId?.name,
  items: (o.items ?? []).map((i: Doc) => ({ productId: String(i.productId), name: i.name, qty: i.qty, unitPrice: i.unitPrice })),
  subtotal: o.subtotal, deliveryFee: o.deliveryFee ?? 0, total: o.total, deliveryRequired: !!o.deliveryRequired,
  deliveryAddress: o.deliveryAddress ?? "", note: o.note ?? "", status: o.status, paymentRef: s(o.paymentRef), createdAt: d(o.createdAt),
});
export const toBooking = (b: Doc): BookingDTO => ({
  id: String(b._id), customerId: String(b.customerId?._id ?? b.customerId), businessId: String(b.businessId?._id ?? b.businessId),
  businessName: b.businessId?.name, customerName: b.customerId?.name, serviceId: String(b.serviceId), serviceName: b.serviceName ?? "",
  startAt: d(b.startAt), endAt: d(b.endAt), price: b.price, note: b.note ?? "", status: b.status, createdAt: d(b.createdAt),
});
export const toDelivery = (x: Doc): DeliveryDTO => ({
  id: String(x._id), orderId: String(x.orderId?._id ?? x.orderId), businessId: String(x.businessId?._id ?? x.businessId), businessName: x.businessId?.name,
  runnerId: s(x.runnerId?._id ?? x.runnerId), runnerName: x.runnerId?.name, pickup: x.pickup ?? "", dropoff: x.dropoff ?? "", fee: x.fee, runnerShare: x.runnerShare,
  status: x.status, createdAt: d(x.createdAt), items: x.orderId?.items ? x.orderId.items.map((i: Doc) => `${i.name} ×${i.qty}`).join(", ") : undefined,
});
