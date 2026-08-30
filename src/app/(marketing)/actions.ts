"use server";

import { redirect } from "next/navigation";
import { auth, updateSession } from "@/lib/auth";
import { businessSchema, runnerSchema } from "@/lib/validation/business";
import { createBusiness, getBusinessByOwner } from "@/server/services/businesses";
import { addRole } from "@/server/services/users";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/server/models";
import type { FormState } from "@/app/(auth)/actions";

function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fields: Record<string, string> = {};
  for (const i of issues) fields[String(i.path[0])] = i.message;
  return { fields };
}

export async function createBusinessAction(_: FormState, form: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/sell");
  if (await getBusinessByOwner(session.user.id)) redirect("/dashboard");
  const parsed = businessSchema.safeParse({ ...Object.fromEntries(form), logoUrl: String(form.get("logo") ?? ""), coverUrl: String(form.get("cover") ?? "") });
  if (!parsed.success) return fieldErrors(parsed.error.issues);
  await createBusiness(session.user.id, parsed.data);
  const roles = new Set(session.user.roles);
  if (parsed.data.type !== "services") roles.add("seller");
  if (parsed.data.type !== "products") roles.add("provider");
  await updateSession({ roles: [...roles] } as never);
  redirect("/dashboard/products?welcome=1");
}

export async function becomeRunnerAction(_: FormState, form: FormData): Promise<FormState> {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/deliver");
  const parsed = runnerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fieldErrors(parsed.error.issues);
  await connectDB();
  await User.updateOne({ _id: session.user.id }, { $set: { phone: parsed.data.phone } });
  await addRole(session.user.id, "runner");
  await updateSession({ roles: [...new Set([...session.user.roles, "runner"])] } as never);
  redirect("/runner");
}
