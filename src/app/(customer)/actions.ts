"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { addToCart, setCartQty, getCart } from "@/server/services/cart";
import { createOrderFromCart } from "@/server/services/orders";
import { createBooking, setBookingStatus } from "@/server/services/bookings";
import { createReview } from "@/server/services/reviews";
import { initializePayment, makeReference } from "@/lib/payments/paystack";

async function user(next: string) {
  const session = await auth();
  if (!session?.user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session.user;
}
const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const msg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export async function addToCartAction(form: FormData) {
  const productId = String(form.get("productId"));
  const u = await user(`/p/${productId}`);
  const { replaced } = await addToCart(u.id, productId, Number(form.get("qty") ?? 1));
  revalidatePath("/cart");
  redirect(`/cart${replaced ? "?replaced=1" : ""}`);
}

export async function setQtyAction(form: FormData) {
  const u = await user("/cart");
  await setCartQty(u.id, String(form.get("productId")), Number(form.get("qty")));
  revalidatePath("/cart");
}

export type CheckoutState = { error?: string };
export async function checkoutAction(_: CheckoutState, form: FormData): Promise<CheckoutState> {
  const u = await user("/checkout");
  const deliveryRequired = form.get("fulfilment") === "delivery";
  const deliveryAddress = String(form.get("address") ?? "").trim();
  if (deliveryRequired && deliveryAddress.length < 3) return { error: "Enter where we should deliver to." };
  const cart = await getCart(u.id);
  if (!cart.items.length) return { error: "Your cart is empty." };
  const reference = makeReference("ord");
  let url: string;
  try {
    const order = await createOrderFromCart(u.id, { deliveryRequired, deliveryAddress, note: String(form.get("note") ?? ""), paymentRef: reference });
    ({ authorizationUrl: url } = await initializePayment({ email: u.email ?? "", amountNgn: order.total, reference, callbackUrl: `${appUrl()}/pay/callback`, metadata: { type: "order", orderId: order.id } }));
  } catch (e) { return { error: msg(e) }; }
  redirect(url);
}

export type BookState = { error?: string };
export async function bookAction(_: BookState, form: FormData): Promise<BookState> {
  const serviceId = String(form.get("serviceId"));
  const u = await user(`/s/${serviceId}`);
  const startAt = String(form.get("startAt") ?? "");
  if (!startAt) return { error: "Pick a time slot." };
  const reference = makeReference("bk");
  let url: string;
  try {
    const b = await createBooking(u.id, serviceId, startAt, String(form.get("note") ?? ""), reference);
    ({ authorizationUrl: url } = await initializePayment({ email: u.email ?? "", amountNgn: b.price, reference, callbackUrl: `${appUrl()}/pay/callback`, metadata: { type: "booking", bookingId: b.id } }));
  } catch (e) { return { error: msg(e) }; }
  redirect(url);
}

export async function cancelBookingAction(form: FormData) {
  const u = await user("/bookings");
  await setBookingStatus(String(form.get("bookingId")), { customerId: u.id }, "cancelled");
  revalidatePath("/bookings");
}

export type ReviewState = { error?: string; done?: boolean };
export async function reviewAction(_: ReviewState, form: FormData): Promise<ReviewState> {
  const u = await user("/orders");
  const refType = form.get("refType") === "booking" ? "booking" : "order";
  try {
    await createReview({ id: u.id, name: u.name ?? "Student" }, refType, String(form.get("refId")), Number(form.get("rating")), String(form.get("text") ?? "").trim());
  } catch (e) { return { error: msg(e) }; }
  revalidatePath("/orders"); revalidatePath("/bookings");
  return { done: true };
}
