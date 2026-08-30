"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { registerUser } from "@/server/services/users";

export type FormState = { error?: string; fields?: Record<string, string> };

function safeNext(v: FormDataEntryValue | null) {
  return typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : "/discover";
}

export async function registerAction(_: FormState, form: FormData): Promise<FormState> {
  const raw = Object.fromEntries(form) as Record<string, string>;
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] = issue.message;
    return { fields };
  }
  const result = await registerUser(parsed.data);
  if (!result.ok) return { error: result.error };
  await signIn("credentials", { email: parsed.data.email, password: parsed.data.password, redirect: false });
  redirect("/discover");
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Enter your email and password." };
  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Wrong email or password." };
    throw e;
  }
  redirect(safeNext(form.get("next")));
}
