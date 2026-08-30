"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { setBusinessStatus } from "@/server/services/admin";

export async function businessStatusAction(form: FormData) {
  await requireUser("admin");
  await setBusinessStatus(String(form.get("id")), form.get("status") === "suspended" ? "suspended" : "active");
  revalidatePath("/admin/businesses"); revalidatePath("/discover");
}
