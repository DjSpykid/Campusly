export const ORDER_STATUS = ["pending_payment", "paid", "ready", "out_for_delivery", "delivered", "cancelled"] as const;
export const BOOKING_STATUS = ["pending_payment", "confirmed", "completed", "cancelled"] as const;
export const DELIVERY_STATUS = ["requested", "accepted", "picked_up", "delivered", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUS)[number];
export type BookingStatus = (typeof BOOKING_STATUS)[number];
export type DeliveryStatus = (typeof DELIVERY_STATUS)[number];

export const STATUS_TONE: Record<string, "neutral" | "warning" | "success" | "danger" | "primary"> = {
  pending_payment: "warning", requested: "warning",
  paid: "primary", ready: "primary", accepted: "primary", picked_up: "primary", out_for_delivery: "primary", confirmed: "primary",
  delivered: "success", completed: "success",
  cancelled: "danger",
};
