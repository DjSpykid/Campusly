"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema, serviceSchema, businessSchema, availabilitySchema } from "@/lib/validation/business";
import { createProduct, updateProduct, deleteProduct, createService, updateService, deleteService } from "@/server/services/listings";
import { setOrderStatus, requestDelivery } from "@/server/services/orders";
import { setBookingStatus } from "@/server/services/bookings";
import { updateBusiness } from "@/server/services/businesses";
import { requireBusiness } from "./business";
import type { FormState } from "@/app/(auth)/actions";

const fieldErrors = (issues: { path: PropertyKey[]; message: string }[]) => {
  const fields: Record<string, string> = {};
  for (const i of issues) fields[String(i.path[0])] = i.message;
  return { fields };
};
const msg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export async function saveProductAction(_: FormState, form: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const parsed = productSchema.safeParse({ ...Object.fromEntries(form), images: form.getAll("images").map(String), inStock: form.get("inStock") === "on" });
  if (!parsed.success) return fieldErrors(parsed.error.issues);
  const id = form.get("id");
  if (id) await updateProduct(String(id), business.id, parsed.data); else await createProduct(business.id, parsed.data);
  revalidatePath("/dashboard/products"); revalidatePath("/discover");
  redirect("/dashboard/products");
}
export async function deleteProductAction(form: FormData) {
  const { business } = await requireBusiness();
  await deleteProduct(String(form.get("id")), business.id);
  revalidatePath("/dashboard/products");
}
export async function saveServiceAction(_: FormState, form: FormData): Promise<FormState> {
  const { business } = await requireBusiness();
  const parsed = serviceSchema.safeParse({ ...Object.fromEntries(form), images: form.getAll("images").map(String), active: form.get("active") === "on" });
  if (!parsed.success) return fieldErrors(parsed.error.issues);
  const id = form.get("id");
  if (id) await updateService(String(id), business.id, parsed.data); else await createService(business.id, parsed.data);
  revalidatePath("/dashboard/services"); revalidatePath("/discover");
  redirect("/dashboard/services");
}
export async function deleteServiceAction(form: FormData) {
  const { business } = await requireBusiness();
  await deleteService(String(form.get("id")), business.id);
  revalidatePath("/dashboard/services");
}
export async function orderStatusAction(form: FormData) {
  const { business } = await requireBusiness();
  const status = String(form.get("status"));
  try {
    if (status === "request_delivery") await requestDelivery(String(form.get("orderId")), business.id);
    else await setOrderStatus(String(form.get("orderId")), business.id, status);
  } catch (e) { console.error(msg(e)); }
  revalidatePath("/dashboard/orders"); revalidatePath("/dashboard");
}
export async function bookingStatusAction(form: FormData) {
  const { business } = await requireBusiness();
  const status = form.get("status") === "completed" ? "completed" : "cancelled";
  try { await setBookingStatus(String(form.get("bookingId")), { businessId: business.id }, status); } catch (e) { console.error(msg(e)); }
  revalidatePath("/dashboard/bookings"); revalidatePath("/dashboard");
}
export async function saveSettingsAction(_: FormState, form: FormData): Promise<FormState> {
  const { user, business } = await requireBusiness();
  const parsed = businessSchema.omit({ type: true }).safeParse({ ...Object.fromEntries(form), logoUrl: String(form.get("logo") ?? ""), coverUrl: String(form.get("cover") ?? "") });
  if (!parsed.success) return fieldErrors(parsed.error.issues);
  const availability = [0, 1, 2, 3, 4, 5, 6].filter((d) => form.get(`open-${d}`) === "on").map((d) => ({ day: d, start: String(form.get(`start-${d}`) || "09:00"), end: String(form.get(`end-${d}`) || "17:00") }));
  const av = availabilitySchema.safeParse(availability);
  if (!av.success) return { error: "Check your opening hours (HH:MM)." };
  await updateBusiness(business.id, user.id, { ...parsed.data, availability: av.data });
  revalidatePath("/dashboard/settings"); revalidatePath(`/b/${business.slug}`);
  return { error: undefined, fields: { saved: "1" } };
}
