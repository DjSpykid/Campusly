"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { acceptDelivery, advanceDelivery } from "@/server/services/deliveries";

export async function acceptDeliveryAction(form: FormData) {
  const u = await requireUser("runner");
  try { await acceptDelivery(String(form.get("id")), u.id); } catch (e) { console.error(e); }
  revalidatePath("/runner"); revalidatePath("/runner/deliveries");
}
export async function advanceDeliveryAction(form: FormData) {
  const u = await requireUser("runner");
  try { await advanceDelivery(String(form.get("id")), u.id); } catch (e) { console.error(e); }
  revalidatePath("/runner"); revalidatePath("/runner/deliveries"); revalidatePath("/orders");
}
