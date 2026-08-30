export type BusinessDTO = {
  id: string; ownerId: string; name: string; slug: string; description: string; logoUrl?: string; coverUrl?: string;
  type: "products" | "services" | "both"; category: string; location: string;
  contact: { phone?: string; whatsapp?: string; instagram?: string };
  availability: { day: number; start: string; end: string }[];
  ratingAvg: number; ratingCount: number; status: "active" | "suspended";
};
export type ProductDTO = { id: string; businessId: string; name: string; description: string; price: number; images: string[]; category: string; inStock: boolean; businessName?: string; businessSlug?: string };
export type ServiceDTO = { id: string; businessId: string; name: string; description: string; price: number; durationMins: number; images: string[]; category: string; active: boolean; businessName?: string; businessSlug?: string };
export type OrderItemDTO = { productId: string; name: string; qty: number; unitPrice: number };
export type OrderDTO = { id: string; customerId: string; businessId: string; businessName?: string; customerName?: string; items: OrderItemDTO[]; subtotal: number; deliveryFee: number; total: number; deliveryRequired: boolean; deliveryAddress: string; note: string; status: string; paymentRef?: string; createdAt: string; delivery?: DeliveryDTO | null; reviewed?: boolean };
export type BookingDTO = { id: string; customerId: string; businessId: string; businessName?: string; customerName?: string; serviceId: string; serviceName: string; startAt: string; endAt: string; price: number; note: string; status: string; createdAt: string; reviewed?: boolean };
export type DeliveryDTO = { id: string; orderId: string; businessId: string; businessName?: string; runnerId?: string; runnerName?: string; pickup: string; dropoff: string; fee: number; runnerShare: number; status: string; createdAt: string; items?: string };
export type CartDTO = { businessId?: string; businessName?: string; items: { productId: string; name: string; qty: number; unitPrice: number; image?: string; inStock: boolean }[]; subtotal: number };
export type ReviewDTO = { id: string; authorName: string; rating: number; text: string; createdAt: string };
export type TransactionDTO = { id: string; refType: "order" | "booking"; refId: string; gross: number; commission: number; net: number; createdAt: string; customerName?: string };
