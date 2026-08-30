import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/config/roles";

export async function requireUser(role?: Role) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (role && !session.user.roles.includes(role)) redirect("/");
  return session.user;
}
