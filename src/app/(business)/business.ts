import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getBusinessByOwner } from "@/server/services/businesses";

export async function requireBusiness() {
  const user = await requireUser();
  const business = await getBusinessByOwner(user.id);
  if (!business) redirect("/sell");
  return { user, business };
}
